/**
 * i18n.js — ระบบสลับภาษา UI สำหรับ DMV Practice Test
 *
 * วิธีใช้ในหน้า HTML:
 *   - ข้อความล้วน:        <span data-i18n="home.hero.title">...</span>
 *   - ข้อความที่มี HTML:   <p data-i18n-html="home.hero.desc">...</p>
 *   - แอตทริบิวต์:         <button data-i18n-attr="aria-label:home.support.close">...</button>
 *                          (คั่นหลายคู่ด้วย ; เช่น "aria-label:a.b;title:c.d")
 *
 * การเพิ่มภาษาใหม่: เติม code ใน I18N_LANGS แล้วเติม key ให้ครบในทุก namespace ของ I18N_DICT
 * การแปลเนื้อหาข้อสอบ (data.js) เป็นอีกชั้นหนึ่ง แยกเป็นไฟล์ assets/js/translations/<lang>.js ภายหลัง
 */

const I18N_LANGS = [
  { code: 'th', label: 'ไทย' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'Español' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

const I18N_DICT = {
  // ── chrome ที่ใช้ร่วมกันทุกหน้า ──────────────────────────────
  'lang.select': {
    th: 'เลือกภาษา', en: 'Select language', ja: '言語を選択', zh: '选择语言',
    es: 'Seleccionar idioma', vi: 'Chọn ngôn ngữ', fr: 'Choisir la langue', de: 'Sprache wählen',
  },
  'header.sub': {
    th: 'State of California — ซ้อมสอบใบขับขี่', en: 'State of California — Driving Test Practice',
    ja: 'カリフォルニア州 — 運転免許試験対策', zh: '加利福尼亚州 — 驾照考试练习',
    es: 'Estado de California — Práctica de examen de manejo', vi: 'Tiểu bang California — Luyện thi lái xe',
    fr: 'État de Californie — Préparation à l\'examen de conduite', de: 'Bundesstaat Kalifornien — Führerschein­prüfung üben',
  },
  'footer.text': {
    th: 'California DMV Written Test Practice — ซ้อมสอบใบขับขี่หลายภาษา | ข้อมูลอ้างอิงจาก California Driver Handbook',
    en: 'California DMV Written Test Practice — multilingual driving test prep | Content based on the California Driver Handbook',
    ja: 'カリフォルニアDMV筆記試験対策 — 多言語対応 | California Driver Handbook を参考に作成',
    zh: '加州DMV笔试练习 — 多语言版 | 内容参考 California Driver Handbook',
    es: 'Práctica del examen escrito del DMV de California — multilingüe | Contenido basado en el California Driver Handbook',
    vi: 'Luyện thi viết DMV California — đa ngôn ngữ | Nội dung dựa trên California Driver Handbook',
    fr: 'Préparation à l\'examen écrit du DMV de Californie — multilingue | Contenu basé sur le California Driver Handbook',
    de: 'Vorbereitung auf die DMV-Schriftprüfung Kalifornien — mehrsprachig | Inhalt basiert auf dem California Driver Handbook',
  },
  'nav.back': {
    th: 'กลับหน้าหลัก', en: 'Back to home', ja: 'ホームに戻る', zh: '返回首页',
    es: 'Volver al inicio', vi: 'Về trang chủ', fr: 'Retour à l\'accueil', de: 'Zurück zur Startseite',
  },

  // ── หน้าหลัก (index.html) ───────────────────────────────────
  'home.title': {
    th: 'DMV Practice Test — ซ้อมสอบใบขับขี่หลายภาษา',
    en: 'DMV Practice Test — Multilingual Driving Test Prep',
    ja: 'DMV模擬試験 — 多言語運転免許対策',
    zh: 'DMV模拟考试 — 多语言驾考练习',
    es: 'DMV Practice Test — Preparación de examen multilingüe',
    vi: 'DMV Practice Test — Luyện thi lái xe đa ngôn ngữ',
    fr: 'DMV Practice Test — Préparation multilingue à l\'examen',
    de: 'DMV Practice Test — Mehrsprachige Prüfungsvorbereitung',
  },
  'home.hero.title': {
    th: 'ซ้อมสอบใบขับขี่ California',
    en: 'Practice for the California Driving Test',
    ja: 'カリフォルニア運転免許試験の練習',
    zh: '加州驾照考试练习',
    es: 'Practica para el examen de manejo de California',
    vi: 'Luyện thi lấy bằng lái xe California',
    fr: 'Entraînez-vous à l\'examen de conduite de Californie',
    de: 'Übe für die kalifornische Führerscheinprüfung',
  },
  'home.hero.desc': {
    th: 'รวมข้อสอบหลายชุด พร้อมคำแปลหลายภาษา<br>เลือกชุดที่ต้องการด้านล่าง แล้วกด <strong>เริ่มสอบ</strong>',
    en: 'A full question bank with multiple languages<br>Pick a set below and press <strong>Start</strong>',
    ja: '多言語対応の問題集<br>下から問題セットを選んで <strong>開始</strong> を押してください',
    zh: '多语言题库<br>在下方选择题组，然后点击 <strong>开始测验</strong>',
    es: 'Banco de preguntas completo en varios idiomas<br>Elige un conjunto abajo y presiona <strong>Comenzar</strong>',
    vi: 'Bộ câu hỏi đầy đủ với nhiều ngôn ngữ<br>Chọn bộ đề bên dưới rồi nhấn <strong>Bắt đầu</strong>',
    fr: 'Une banque de questions complète en plusieurs langues<br>Choisissez un ensemble ci-dessous et appuyez sur <strong>Commencer</strong>',
    de: 'Eine vollständige Fragensammlung in mehreren Sprachen<br>Wähle unten ein Set und klicke auf <strong>Start</strong>',
  },
  'home.info.total': {
    th: 'ข้อ รวมทั้งหมด', en: 'questions total', ja: '問（全問）', zh: '题（全部）',
    es: 'preguntas en total', vi: 'câu hỏi tổng cộng', fr: 'questions au total', de: 'Fragen insgesamt',
  },
  'home.info.sets': {
    th: 'ชุด ๆ ละ 10 ข้อ', en: 'sets of 10 questions', ja: 'セット（各10問）', zh: '组，每组10题',
    es: 'conjuntos de 10 preguntas', vi: 'bộ, mỗi bộ 10 câu', fr: 'séries de 10 questions', de: 'Sets mit je 10 Fragen',
  },
  'home.info.pass': {
    th: 'เกณฑ์ผ่าน 83%', en: 'Passing score: 83%', ja: '合格基準: 83%', zh: '及格标准：83%',
    es: 'Puntaje para aprobar: 83%', vi: 'Điểm đạt: 83%', fr: 'Score de réussite : 83 %', de: 'Bestehensgrenze: 83 %',
  },
  'home.support.chip': {
    th: 'สนับสนุนผู้พัฒนา', en: 'Support the developer', ja: '開発者を応援する', zh: '支持开发者',
    es: 'Apoyar al desarrollador', vi: 'Ủng hộ nhà phát triển', fr: 'Soutenir le développeur', de: 'Entwickler unterstützen',
  },
  'home.notice.label': {
    th: 'คำแนะนำ:', en: 'Tip:', ja: 'ご案内:', zh: '提示：',
    es: 'Consejo:', vi: 'Lưu ý:', fr: 'Conseil :', de: 'Hinweis:',
  },
  'home.notice.text': {
    th: 'โปรดศึกษา <em>คู่มือผู้ขับขี่ยานยนต์ของรัฐแคลิฟอร์เนีย</em> ก่อนทำการทดสอบ แต่ละคำถามจะมีคำตอบให้เลือกสามข้อ เลือกคำตอบที่ถูกต้องที่สุดเพียงหนึ่งข้อ',
    en: 'Please review the <em>California Driver Handbook</em> before testing. Each question has three choices — pick the single best answer.',
    ja: '受験前に <em>カリフォルニア州ドライバーハンドブック</em> を確認してください。各問題には3つの選択肢があり、最も適切な答えを1つ選んでください。',
    zh: '考试前请先阅读 <em>加州驾驶员手册</em>。每道题有三个选项，请选择最恰当的一个答案。',
    es: 'Por favor revise el <em>Manual del Conductor de California</em> antes de la prueba. Cada pregunta tiene tres opciones — elija la mejor respuesta.',
    vi: 'Vui lòng đọc <em>Sổ tay người lái xe California</em> trước khi thi. Mỗi câu hỏi có ba lựa chọn — hãy chọn đáp án đúng nhất.',
    fr: 'Veuillez consulter le <em>Manuel du conducteur de Californie</em> avant le test. Chaque question propose trois choix — sélectionnez la meilleure réponse.',
    de: 'Bitte lies vor der Prüfung das <em>California Driver Handbook</em>. Jede Frage hat drei Antwortmöglichkeiten — wähle die beste Antwort.',
  },
  'home.reference.text': {
    th: 'เนื้อหาและแนวข้อสอบอ้างอิงจาก', en: 'Content and question style based on the',
    ja: '内容と出題傾向の参照元:', zh: '内容与题型参考自',
    es: 'Contenido y estilo de preguntas basados en el', vi: 'Nội dung và dạng câu hỏi dựa trên',
    fr: 'Contenu et style des questions basés sur le', de: 'Inhalt und Fragestil basieren auf dem',
  },
  'home.reference.link': {
    th: 'California DMV Driver Handbook', en: 'California DMV Driver Handbook',
    ja: 'California DMV Driver Handbook', zh: 'California DMV Driver Handbook',
    es: 'California DMV Driver Handbook', vi: 'California DMV Driver Handbook',
    fr: 'California DMV Driver Handbook', de: 'California DMV Driver Handbook',
  },
  'home.reference.suffix': {
    th: 'เพื่อใช้สำหรับฝึกทำข้อสอบเท่านั้น', en: 'for practice purposes only.',
    ja: '練習用としてのみ提供しています。', zh: '仅供练习使用。',
    es: 'únicamente para fines de práctica.', vi: 'chỉ nhằm mục đích luyện tập.',
    fr: 'à des fins d\'entraînement uniquement.', de: 'ausschließlich zu Übungszwecken.',
  },
  'home.banner.handbook.badge': {
    th: 'คู่มือ', en: 'Handbook', ja: 'ハンドブック', zh: '手册',
    es: 'Manual', vi: 'Sổ tay', fr: 'Manuel', de: 'Handbuch',
  },
  'home.banner.handbook.title': {
    th: 'คู่มือผู้ขับขี่ California', en: 'California Driver Handbook',
    ja: 'カリフォルニア・ドライバーハンドブック', zh: '加州驾驶员手册',
    es: 'Manual del Conductor de California', vi: 'Sổ tay người lái xe California',
    fr: 'Manuel du conducteur de Californie', de: 'California Driver Handbook',
  },
  'home.banner.handbook.desc': {
    th: 'แปลครบ 9 บทจาก California Quick Reference Driver\'s Handbook (DL 600X) อ่านก่อนสอบ',
    en: 'All 9 chapters of the California Quick Reference Driver\'s Handbook (DL 600X) — read it before your test',
    ja: 'California Quick Reference Driver\'s Handbook（DL 600X）全9章を収録。受験前にお読みください',
    zh: '收录 California Quick Reference Driver\'s Handbook（DL 600X）全部9章，考前必读',
    es: 'Los 9 capítulos completos del California Quick Reference Driver\'s Handbook (DL 600X) — léalo antes del examen',
    vi: 'Đầy đủ 9 chương của California Quick Reference Driver\'s Handbook (DL 600X) — hãy đọc trước khi thi',
    fr: 'Les 9 chapitres complets du California Quick Reference Driver\'s Handbook (DL 600X) — à lire avant l\'examen',
    de: 'Alle 9 Kapitel des California Quick Reference Driver\'s Handbook (DL 600X) — vor der Prüfung lesen',
  },
  'home.banner.handbook.cta': {
    th: 'อ่านคู่มือ', en: 'Read the handbook', ja: 'ハンドブックを読む', zh: '阅读手册',
    es: 'Leer el manual', vi: 'Đọc sổ tay', fr: 'Lire le manuel', de: 'Handbuch lesen',
  },
  'home.banner.practice.badge': {
    th: 'ฝึกซ้อม', en: 'Practice', ja: '練習', zh: '练习',
    es: 'Practicar', vi: 'Luyện tập', fr: 'Entraînement', de: 'Übung',
  },
  'home.banner.practice.title': {
    th: 'ฝึกซ้อมข้อสอบเต็มชุด พร้อมเฉลยทันที',
    en: 'Practice the full question bank with instant answers',
    ja: '全問演習 — 解答をすぐに確認', zh: '全题库练习，立即查看答案',
    es: 'Practica todo el banco de preguntas con respuestas instantáneas',
    vi: 'Luyện toàn bộ ngân hàng câu hỏi, xem đáp án ngay',
    fr: 'Entraînez-vous sur toute la banque de questions avec correction immédiate',
    de: 'Übe die gesamte Fragensammlung mit sofortiger Lösung',
  },
  'home.banner.practice.desc': {
    th: 'สุ่มคำถามจากคลังข้อสอบทั้งหมด — ตอบผิดเห็นเฉลยทันที ไม่มีจำกัดเวลา',
    en: 'Randomized questions from the full bank — see the answer instantly when wrong, no time limit',
    ja: '全問題からランダム出題 — 誤答時はすぐに正解を表示。制限時間なし',
    zh: '从全部题库中随机抽题 — 答错立刻显示正确答案，无时间限制',
    es: 'Preguntas aleatorias de todo el banco — vea la respuesta correcta al instante si falla, sin límite de tiempo',
    vi: 'Câu hỏi ngẫu nhiên từ toàn bộ ngân hàng — trả lời sai sẽ thấy đáp án ngay, không giới hạn thời gian',
    fr: 'Questions aléatoires tirées de toute la banque — la bonne réponse s\'affiche immédiatement en cas d\'erreur, sans limite de temps',
    de: 'Zufällige Fragen aus der gesamten Sammlung — bei Fehlern sofort die richtige Antwort sehen, ohne Zeitlimit',
  },
  'home.banner.practice.cta': {
    th: 'เริ่มฝึกซ้อม', en: 'Start practicing', ja: '練習を始める', zh: '开始练习',
    es: 'Comenzar a practicar', vi: 'Bắt đầu luyện tập', fr: 'Commencer l\'entraînement', de: 'Übung starten',
  },
  'home.banner.mock.badge': {
    th: 'สอบจำลอง', en: 'Mock exam', ja: '模擬試験', zh: '模拟考试',
    es: 'Examen simulado', vi: 'Thi thử', fr: 'Examen blanc', de: 'Probeprüfung',
  },
  'home.banner.mock.title': {
    th: 'จำลองการสอบจริง 46 ข้อ', en: 'Simulate the real 46-question exam',
    ja: '本番形式の模擬試験（46問）', zh: '模拟真实考试，共46题',
    es: 'Simula el examen real de 46 preguntas', vi: 'Mô phỏng kỳ thi thật với 46 câu',
    fr: 'Simulez l\'examen réel de 46 questions', de: 'Simuliere die echte 46-Fragen-Prüfung',
  },
  'home.banner.mock.desc': {
    th: 'สุ่มคำถามจากคลังข้อสอบทั้งหมด — ผ่านเมื่อตอบถูกอย่างน้อย 38 ข้อ (83%) มีเวลา 40 นาที',
    en: 'Randomized questions from the full bank — pass with at least 38 correct (83%), 40-minute time limit',
    ja: '全問題からランダム出題 — 38問以上正解（83%）で合格、制限時間40分',
    zh: '从全部题库中随机抽题 — 答对38题（83%）以上即合格，限时40分钟',
    es: 'Preguntas aleatorias de todo el banco — apruebe con al menos 38 correctas (83%), límite de 40 minutos',
    vi: 'Câu hỏi ngẫu nhiên từ toàn bộ ngân hàng — đạt khi trả lời đúng ít nhất 38 câu (83%), giới hạn 40 phút',
    fr: 'Questions aléatoires tirées de toute la banque — réussite avec au moins 38 bonnes réponses (83 %), limite de 40 minutes',
    de: 'Zufällige Fragen aus der gesamten Sammlung — bestanden mit mindestens 38 richtigen Antworten (83 %), 40 Minuten Zeitlimit',
  },
  'home.banner.mock.cta': {
    th: 'เริ่มสอบจำลอง', en: 'Start the mock exam', ja: '模擬試験を始める', zh: '开始模拟考试',
    es: 'Comenzar examen simulado', vi: 'Bắt đầu thi thử', fr: 'Commencer l\'examen blanc', de: 'Probeprüfung starten',
  },
  'home.grid.title': {
    th: 'เลือกชุดข้อสอบ', en: 'Choose a question set', ja: '出題セットを選択', zh: '选择题组',
    es: 'Elige un conjunto de preguntas', vi: 'Chọn bộ đề', fr: 'Choisissez une série de questions', de: 'Wähle ein Frageset',
  },
  'home.support.modal.title': {
    th: 'สนับสนุนผู้พัฒนา', en: 'Support the developer', ja: '開発者を応援する', zh: '支持开发者',
    es: 'Apoyar al desarrollador', vi: 'Ủng hộ nhà phát triển', fr: 'Soutenir le développeur', de: 'Entwickler unterstützen',
  },
  'home.support.modal.text': {
    th: 'เว็บไซต์นี้จัดทำขึ้นเพื่อช่วยผู้สอบใบขับขี่ในหลายภาษา หากมีประโยชน์ สามารถสนับสนุนค่าเว็บไซต์ได้ตามสมัครใจ',
    en: 'This site was built to help people preparing for the driving test in multiple languages. If it helped you, voluntary support is welcome.',
    ja: '本サイトは多言語で運転免許試験の準備をする方を支援するために作成しました。お役に立てましたら任意でのご支援をお願いします。',
    zh: '本站旨在以多种语言帮助大家备考驾照。如果对您有帮助，欢迎自愿支持网站运营费用。',
    es: 'Este sitio se creó para ayudar a quienes se preparan para el examen de manejo en varios idiomas. Si te resultó útil, el apoyo voluntario es bienvenido.',
    vi: 'Trang web này được tạo ra để giúp mọi người ôn thi lái xe bằng nhiều ngôn ngữ. Nếu thấy hữu ích, bạn có thể ủng hộ chi phí duy trì trang web theo khả năng.',
    fr: 'Ce site a été créé pour aider les personnes qui préparent l\'examen de conduite dans plusieurs langues. S\'il vous a aidé, un soutien volontaire est bienvenu.',
    de: 'Diese Seite wurde erstellt, um Menschen bei der Vorbereitung auf die Führerscheinprüfung in mehreren Sprachen zu helfen. Wenn sie dir geholfen hat, ist eine freiwillige Unterstützung willkommen.',
  },
  'home.support.modal.note': {
    th: 'ไม่ใช่เว็บไซต์ทางการของ California DMV และไม่มีการบังคับชำระเงินเพื่อใช้งาน',
    en: 'This is not an official California DMV website, and payment is never required to use it.',
    ja: '本サイトはカリフォルニア州DMVの公式サイトではなく、利用に料金は必要ありません。',
    zh: '本站并非加州DMV官方网站，使用本站无需付费。',
    es: 'Este no es un sitio oficial del DMV de California y nunca se requiere pago para usarlo.',
    vi: 'Đây không phải là trang web chính thức của DMV California và không yêu cầu thanh toán để sử dụng.',
    fr: 'Ce site n\'est pas un site officiel du DMV de Californie et son utilisation ne requiert aucun paiement.',
    de: 'Dies ist keine offizielle Website der California DMV, und für die Nutzung ist keine Zahlung erforderlich.',
  },
  'home.support.close': {
    th: 'ปิดหน้าต่างสนับสนุน', en: 'Close support dialog', ja: '応援ウィンドウを閉じる', zh: '关闭支持窗口',
    es: 'Cerrar ventana de apoyo', vi: 'Đóng cửa sổ ủng hộ', fr: 'Fermer la fenêtre de soutien', de: 'Unterstützungsfenster schließen',
  },

  // ── ชุดข้อสอบมอเตอร์ไซค์ (motorcycle.html) ──────────────────
  'home.banner.moto.badge': {
    th: 'มอเตอร์ไซค์', en: 'Motorcycle', ja: 'バイク', zh: '摩托车',
    es: 'Motocicleta', vi: 'Xe máy', fr: 'Moto', de: 'Motorrad',
  },
  'home.banner.moto.title': {
    th: 'ข้อสอบใบขับขี่มอเตอร์ไซค์', en: 'Motorcycle license exam',
    ja: 'バイク運転免許試験', zh: '摩托车驾照考试',
    es: 'Examen de licencia de motocicleta', vi: 'Đề thi bằng lái xe máy',
    fr: 'Examen du permis moto', de: 'Motorrad-Führerscheinprüfung',
  },
  'home.banner.moto.desc': {
    th: 'ฝึกซ้อมข้อสอบใบขับขี่มอเตอร์ไซค์ (Class M1/M2) อ้างอิงจาก California Motorcycle Handbook',
    en: 'Practice for the California motorcycle license exam (Class M1/M2), based on the California Motorcycle Handbook',
    ja: 'カリフォルニア州バイク免許試験（M1/M2クラス）対策。California Motorcycle Handbook を参考に作成',
    zh: '加州摩托车驾照考试练习（M1/M2类），内容参考 California Motorcycle Handbook',
    es: 'Practica para el examen de licencia de motocicleta de California (Clase M1/M2), basado en el California Motorcycle Handbook',
    vi: 'Luyện thi bằng lái xe máy California (Hạng M1/M2), dựa trên California Motorcycle Handbook',
    fr: 'Entraînez-vous à l\'examen du permis moto de Californie (catégorie M1/M2), basé sur le California Motorcycle Handbook',
    de: 'Übe für die kalifornische Motorrad-Führerscheinprüfung (Klasse M1/M2), basierend auf dem California Motorcycle Handbook',
  },
  'home.banner.moto.cta': {
    th: 'เริ่มฝึกซ้อม', en: 'Start practicing', ja: '練習を始める', zh: '开始练习',
    es: 'Comenzar a practicar', vi: 'Bắt đầu luyện tập', fr: 'Commencer l\'entraînement', de: 'Übung starten',
  },
  'moto.title': {
    th: 'DMV — ฝึกซ้อมข้อสอบใบขับขี่มอเตอร์ไซค์', en: 'DMV — Motorcycle License Exam Practice',
    ja: 'DMV — バイク免許試験対策', zh: 'DMV — 摩托车驾照考试练习',
    es: 'DMV — Práctica del examen de licencia de motocicleta', vi: 'DMV — Luyện thi bằng lái xe máy',
    fr: 'DMV — Entraînement à l\'examen du permis moto', de: 'DMV — Übung zur Motorrad-Führerscheinprüfung',
  },
  'moto.label': {
    th: 'มอเตอร์ไซค์', en: 'Motorcycle', ja: 'バイク', zh: '摩托车',
    es: 'Motocicleta', vi: 'Xe máy', fr: 'Moto', de: 'Motorrad',
  },
  'moto.summary.title': {
    th: 'สรุปผลการฝึกซ้อม — ใบขับขี่มอเตอร์ไซค์', en: 'Practice summary — Motorcycle license',
    ja: '練習結果サマリー — バイク免許', zh: '练习总结 — 摩托车驾照',
    es: 'Resumen de práctica — Licencia de motocicleta', vi: 'Tổng kết luyện tập — Bằng lái xe máy',
    fr: 'Résumé de l\'entraînement — Permis moto', de: 'Übungsergebnis — Motorrad-Führerschein',
  },
};

const I18N = (function () {
  const STORAGE_KEY = 'dmv_lang';
  const FALLBACK = 'th';
  const supported = I18N_LANGS.map(l => l.code);
  let current = supported.includes(localStorage.getItem(STORAGE_KEY))
    ? localStorage.getItem(STORAGE_KEY)
    : FALLBACK;

  function t(key) {
    const entry = I18N_DICT[key];
    if (!entry) return key;
    return entry[current] || entry[FALLBACK] || key;
  }

  function apply(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    root.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s && s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
  }

  function setLanguage(lang) {
    if (!supported.includes(lang) || lang === current) return;
    current = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    apply();
    document.querySelectorAll('.lang-switcher select').forEach(sel => { sel.value = lang; });
    document.dispatchEvent(new CustomEvent('dmv:languagechange', { detail: { lang } }));
  }

  function getLanguage() { return current; }

  function buildSwitcher() {
    const wrap = document.createElement('div');
    wrap.className = 'lang-switcher';
    const select = document.createElement('select');
    select.setAttribute('data-i18n-attr', 'aria-label:lang.select');
    select.setAttribute('aria-label', t('lang.select'));
    I18N_LANGS.forEach(({ code, label }) => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = label;
      if (code === current) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', e => setLanguage(e.target.value));
    wrap.appendChild(select);
    return wrap;
  }

  function mountSwitcher() {
    document.querySelectorAll('.site-header').forEach(header => {
      if (header.querySelector('.lang-switcher')) return;
      header.appendChild(buildSwitcher());
    });
  }

  function init() {
    document.documentElement.lang = current;
    mountSwitcher();
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { t, apply, setLanguage, getLanguage, languages: I18N_LANGS };
})();
