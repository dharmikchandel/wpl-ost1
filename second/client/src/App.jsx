import React, { useEffect, useState } from 'react';

function App() {
	const [patients, setPatients] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [form, setForm] = useState({ name: '', age: '', condition: '' });

	async function fetchPatients() {
		try {
			setLoading(true);
			setError('');
			const res = await fetch('/patients');
			if (!res.ok) throw new Error('Failed to load patients');
			const data = await res.json();
			setPatients(data);
		} catch (e) {
			setError(e.message || 'Error fetching patients');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchPatients();
	}, []);

	async function handleAddPatient(e) {
		e.preventDefault();
		try {
			setError('');
			const payload = {
				name: form.name,
				age: Number(form.age),
				condition: form.condition
			};
			const res = await fetch('/patients', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (!res.ok) throw new Error('Failed to add patient');
			const created = await res.json();
			setPatients(prev => [created, ...prev]);
			setForm({ name: '', age: '', condition: '' });
		} catch (e) {
			setError(e.message || 'Error adding patient');
		}
	}

	async function handleDelete(id) {
		try {
			setError('');
			const res = await fetch(`/patients/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Failed to delete patient');
			setPatients(prev => prev.filter(p => p._id !== id));
		} catch (e) {
			setError(e.message || 'Error deleting patient');
		}
	}

	return (
		<div style={styles.container}>
			<h1 style={styles.title}>Patient Management</h1>
			<form onSubmit={handleAddPatient} style={styles.form}>
				<input
					type="text"
					placeholder="Name"
					value={form.name}
					onChange={e => setForm({ ...form, name: e.target.value })}
					style={styles.input}
					required
				/>
				<input
					type="number"
					placeholder="Age"
					value={form.age}
					onChange={e => setForm({ ...form, age: e.target.value })}
					style={styles.input}
					required
				/>
				<input
					type="text"
					placeholder="Condition"
					value={form.condition}
					onChange={e => setForm({ ...form, condition: e.target.value })}
					style={styles.input}
					required
				/>
				<button type="submit" style={styles.button}>Add Patient</button>
			</form>

			{error ? <div style={styles.error}>{error}</div> : null}
			{loading ? (
				<div>Loading...</div>
			) : (
				<ul style={styles.list}>
					{patients.map(p => (
						<li key={p._id} style={styles.listItem}>
							<div>
								<div style={styles.name}>{p.name}</div>
								<div style={styles.meta}>Age: {p.age} • {p.condition}</div>
							</div>
							<button onClick={() => handleDelete(p._id)} style={styles.deleteButton}>Delete</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

const styles = {
	container: {
		maxWidth: 720,
		margin: '40px auto',
		padding: 24,
		background: '#fff',
		borderRadius: 8,
		boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
	},
	title: {
		margin: 0,
		marginBottom: 16,
		fontSize: 28,
		color: '#222'
	},
	form: {
		display: 'flex',
		gap: 12,
		marginBottom: 16
	},
	input: {
		flex: 1,
		padding: '10px 12px',
		border: '1px solid #ddd',
		borderRadius: 6
	},
	button: {
		padding: '10px 14px',
		background: '#2563eb',
		color: '#fff',
		border: 'none',
		borderRadius: 6,
		cursor: 'pointer'
	},
	list: {
		listStyle: 'none',
		padding: 0,
		margin: 0,
		display: 'flex',
		flexDirection: 'column',
		gap: 8
	},
	listItem: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 12,
		border: '1px solid #eee',
		borderRadius: 6
	},
	name: { fontSize: 16, fontWeight: 600 },
	meta: { color: '#666', marginTop: 4 },
	deleteButton: {
		padding: '8px 12px',
		background: '#dc2626',
		color: '#fff',
		border: 'none',
		borderRadius: 6,
		cursor: 'pointer'
	}
};

export default App;


