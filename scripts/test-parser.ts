async function main() {
  const rawText = await (await fetch(
    'https://docs.google.com/document/d/1QBYhtG_cNHkxmlhczzleq6f_AF1us2UZD_AUJGAfsME/export?format=txt',
    { redirect: 'follow' }
  )).text();

  const allLines = rawText.split('\n');
  console.log('Total lines:', allLines.length);
  console.log('\nFirst 40 lines:');
  for (let i = 0; i < Math.min(40, allLines.length); i++) {
    console.log(`${i}: ${JSON.stringify(allLines[i])}`);
  }

  // Check which lines look like horizontal rules
  console.log('\n--- Horizontal rules ---');
  for (let i = 0; i < allLines.length; i++) {
    const t = allLines[i].trim();
    if (/^[_─━═\-]{3,}$/.test(t) || t === '---') {
      console.log(`Line ${i}: ${JSON.stringify(allLines[i])}`);
    }
  }

  // Check for bold headings
  console.log('\n--- Bold headings ---');
  for (let i = 0; i < allLines.length; i++) {
    const t = allLines[i].trim();
    if (/^\*\*[^*]+\*\*/.test(t)) {
      console.log(`Line ${i}: ${t.slice(0, 80)}`);
    }
  }
}
main();
