const fs   = require('fs')
const path = require('path')

const AUDIO_MAP = {
  welcome:       '01_welcome.wav',
  correct:       '02_correct.wav',
  incorrect:     '03_incorrect.wav',
  question_1:    '04_question_1.wav',
  question_2:    '05_question_2.wav',
  question_3:    '06_question_3.wav',
  question_4:    '07_question_4.wav',
  question_5:    '08_question_5.wav',
  question_6:    '09_question_6.wav',
  question_7:    '10_question_7.wav',
  question_8:    '11_question_8.wav',
  explanation_1: '12_explanation_1.wav',
  explanation_2: '13_explanation_2.wav',
  explanation_3: '14_explanation_3.wav',
  explanation_4: '15_explanation_4.wav',
  explanation_5: '16_explanation_5.wav',
  explanation_6: '17_explanation_6.wav',
  explanation_7: '18_explanation_7.wav',
  explanation_8: '19_explanation_8.wav',
  result:        '20_result.wav',
}

const audioDir = path.join(__dirname, 'audio_clips')
const htmlFile = path.join(__dirname, 'cheese-omelet-quiz.html')

let html = fs.readFileSync(htmlFile, 'utf8')

const entries = {}
const missing = []

for (const [key, file] of Object.entries(AUDIO_MAP)) {
  const filePath = path.join(audioDir, file)
  if (fs.existsSync(filePath)) {
    const b64 = fs.readFileSync(filePath).toString('base64')
    entries[key] = `data:audio/wav;base64,${b64}`
    console.log(`  Embedded: ${file}`)
  } else {
    entries[key] = null
    missing.push(file)
    console.warn(`  Missing (skipped): ${file}`)
  }
}

html = html.replace(
  /\/\* AUDIO_DATA_INJECT \*\/[\s\S]*?\/\* END_AUDIO_DATA \*\//,
  `/* AUDIO_DATA_INJECT */\nconst AUDIO_DATA = ${JSON.stringify(entries, null, 2)}\n/* END_AUDIO_DATA */`
)

fs.writeFileSync(htmlFile, html, 'utf8')
console.log(`\nDone. ${Object.keys(entries).length - missing.length} clips embedded into cheese-omelet-quiz.html.`)
if (missing.length) console.log(`${missing.length} clips were missing and will be silent.`)
