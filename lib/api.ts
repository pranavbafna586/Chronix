const API_BASE_URL = 'http://localhost:5000'; // adjust this to your Flask server URL

export async function predictDisease(diseaseId: string, data: Record<string, any>) {
  const response = await fetch(`${API_BASE_URL}/predict/${diseaseId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to get prediction');
  }

  const result = await response.json();
  return Math.floor(100 - result.prediction[0][0] * 100); // Convert probability to percentage and floor the value
}
