/**
 * Sends form data to a Google Apps Script URL to be saved in a Google Sheet.
 * @param formData The data to be sent to the Google Sheet.
 */
export async function kirimKeSheet(formData: any, source: string) {
  const url = 'https://script.google.com/macros/s/AKfycbx9sApQeuZPioHo80oyeqdweO-YXmCV4pvQ58cf4AhomQnR4NFYLpy3d2xRn1CxTWjjLQ/exec';
  
  const payload = {
    ...formData,
    source: source,
    timestamp: new Date().toISOString()
  };
  
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain' }
    });
    console.log(`✅ ${source} synced to Sheet`);
  } catch (error) {
    console.error(`❌ Sync error ${source}:`, error);
  }
}
