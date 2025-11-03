const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB setup
const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017';
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'patientsdb';
const COLLECTION_NAME = 'patients';

let dbClient;
let patientsCollection;

async function connectToDatabase() {
	try {
		const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
		await client.connect();
		dbClient = client;
		const db = client.db(DB_NAME);
		patientsCollection = db.collection(COLLECTION_NAME);
		console.log(`[MongoDB] Connected to ${MONGODB_URI}, db: ${DB_NAME}, collection: ${COLLECTION_NAME}`);
	} catch (error) {
		console.error('[MongoDB] Connection error:', error.message);
		process.exit(1);
	}
}

// Routes
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

// GET /patients - fetch all patients
app.get('/patients', async (req, res) => {
	try {
		const patients = await patientsCollection
			.find({})
			.sort({ _id: -1 })
			.toArray();
		res.json(patients);
	} catch (error) {
		console.error('[GET /patients] Error:', error.message);
		res.status(500).json({ error: 'Failed to fetch patients' });
	}
});

// POST /patients - add a new patient
app.post('/patients', async (req, res) => {
	try {
		const { name, age, condition } = req.body || {};
		if (!name || typeof age === 'undefined' || !condition) {
			return res.status(400).json({ error: 'name, age, and condition are required' });
		}
		const newPatient = {
			name: String(name).trim(),
			age: Number(age),
			condition: String(condition).trim(),
			createdAt: new Date()
		};
		const result = await patientsCollection.insertOne(newPatient);
		console.log('[POST /patients] Inserted ID:', result.insertedId);
		res.status(201).json({ _id: result.insertedId, ...newPatient });
	} catch (error) {
		console.error('[POST /patients] Error:', error.message);
		res.status(500).json({ error: 'Failed to add patient' });
	}
});

// DELETE /patients/:id - delete patient by ID
app.delete('/patients/:id', async (req, res) => {
	try {
		const { id } = req.params;
		if (!ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Invalid patient ID' });
		}
		const result = await patientsCollection.deleteOne({ _id: new ObjectId(id) });
		if (result.deletedCount === 0) {
			return res.status(404).json({ error: 'Patient not found' });
		}
		console.log('[DELETE /patients/:id] Deleted ID:', id);
		res.json({ success: true });
	} catch (error) {
		console.error('[DELETE /patients/:id] Error:', error.message);
		res.status(500).json({ error: 'Failed to delete patient' });
	}
});

// Start server after DB connects
connectToDatabase().then(() => {
	const server = http.createServer(app);
	server.listen(PORT, () => {
		console.log(`[Server] Listening on port ${PORT}`);
	});

	// Graceful shutdown
	process.on('SIGINT', async () => {
		console.log('\n[Server] Shutting down...');
		try {
			if (dbClient) await dbClient.close();
			console.log('[MongoDB] Connection closed');
		} catch (e) {
			console.error('[MongoDB] Error during close:', e.message);
		}
		process.exit(0);
	});
});


