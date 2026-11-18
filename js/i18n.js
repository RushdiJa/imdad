/**
 * Imdad — Translations (Arabic default, RTL / English, LTR)
 * ------------------------------------------------------------------
 * All user-facing text lives here. HTML elements use:
 *   data-i18n="key"             → textContent
 *   data-i18n-html="key"        → innerHTML (only for trusted strings in this file)
 *   data-i18n-attr="attr:key;…" → attributes (aria-label, placeholder, content…)
 * Templates use {placeholders}, filled by t(key, params).
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'imdad-lang';
  var DEFAULT_LANG = 'ar';

  var translations = {
    ar: {
      'meta.title': 'إمداد | اعرف كم باقي من عمر كل دفعة',
      'meta.description': 'إمداد: حسّاس يرافق كل شحنة ونموذج تعلّم آلي يقدّر العمر المتبقي لكل دفعة خضار وفواكه ويوصي بالزبون المناسب عبر واتساب. نموذج أولي — تحدي التجارة الذكية 2026.',
      'skip': 'تخطَّ إلى المحتوى',
      'brand': 'إمداد',
      'nav.problem': 'المشكلة',
      'nav.customer': 'الزبون',
      'nav.how': 'كيف يعمل',
      'nav.demo': 'الحاسبة',
      'nav.allocation': 'التوزيع',
      'nav.whatsapp': 'واتساب',
      'nav.team': 'الفريق',
      'nav.menu': 'القائمة',
      'lang.toggle': 'English',
      'lang.toggleLabel': 'Switch to English',

      'hero.badge': 'تحدي التجارة الذكية 2026 · اللوجستيات وسلاسل الإمداد',
      'hero.tagline': 'اعرف كم باقي من عمر كل دفعة، ولوين تبعتها.',
      'hero.subtitle': 'حسّاس قابل لإعادة الاستخدام يرافق كل شحنة خضار وفواكه، ونموذج تعلّم آلي يقدّر العمر المتبقي لكل دفعة ويوصي بالزبون المناسب — مباشرة على واتساب.',
      'hero.cta': 'جرّب العرض التجريبي',
      'hero.ctaSecondary': 'كيف يعمل؟',
      'hero.card.title': 'دفعة بندورة · الحمرا',
      'hero.card.remaining': 'العمر المتبقي',
      'hero.card.days': 'يوم',
      'hero.card.send': 'ابعتها لـ: سوبرماركت / محافظات بعيدة',
      'hero.card.note': 'مثال توضيحي',

      'problem.kicker': 'المشكلة',
      'problem.title': 'دفعات قُطفت بنفس اليوم… وأعمار مختلفة',
      'problem.intro': 'موزّعو الجملة في الضفة الغربية ينقلون الخضار والفواكه بشاحنات غير مبرّدة عبر الحواجز. الحرارة والتأخير يتلفان الدفعات بشكل غير مرئي.',
      'problem.c1.title': 'تلف حراري خفي',
      'problem.c1.text': 'الدفعة تبدو سليمة عند التحميل، لكن ساعات من الحر داخل صندوق مغلق تستهلك أيامًا من عمرها دون أن يلاحظ أحد.',
      'problem.c2.title': 'تأخير على الحواجز',
      'problem.c2.text': 'الانتظار على حواجز مثل الحمرا وتياسير، أحيانًا تحت الشمس، يجعل عمر كل دفعة مختلفًا حتى لو قُطفت في نفس الصباح.',
      'problem.c3.title': 'الموزّع يدفع ثمن المرتجعات',
      'problem.c3.text': 'دفعات قريبة من التلف تذهب لزبائن يخزّنونها لأيام، فتعود كمرتجعات وخصومات. عقود التوريد تُلزم الموزّع باستبدال التالف خلال 24 ساعة على حسابه، ويخسر ثقة زبائنه.',
      'problem.statementLabel': 'المشكلة بجملة واحدة',
      'problem.statement': 'موزّعو الخضار والفواكه بالجملة في فلسطين بحاجة لطريقة تطابق كل دفعة مع الزبون المناسب حسب عمرها المتبقي، لأن تأخير الحواجز والحرارة يسببان تلفًا خفيًا لا يظهر إلا بعد التسليم.',
      'problem.sources': 'مصادر',
      'problem.f1': '<strong>معهد أبحاث السياسات الاقتصادية الفلسطيني (ماس)، آذار 2025:</strong> 14 حاجزًا على الطرق الرئيسية، بمتوسط تأخير 42 دقيقة لكل حاجز. التأخير روتيني ولا يمكن توقّعه.',
      'problem.f2': '<strong>تقرير PNN، تموز 2025</strong> (مقابلة مع تاجر الخضار الخليلي شادوان أبو سنينة): انتظار من ساعة إلى 4 ساعات على الحواجز ومنها الحمرا؛ تتضرر جودة البضاعة، وتتلف بعض الحمولات بالكامل داخل الشاحنات المغلقة.',
      'problem.f3': '<strong>Cappers وآخرون، جامعة Wageningen وجامعة ميلانو، 2013 (بحث محكّم):</strong> الحرارة والوقت داخل الشاحنات غير المبرّدة سبّبا خسائر ⁦30–50%⁩ في البندورة. التلف يتراكم دون أن يُرى ويمكن التنبؤ به من بيانات الطقس.',
      'problem.f4': '<strong>عطاء توريد، الغد المشرق، آب 2026:</strong> على المورّد استبدال البضاعة التالفة خلال 24 ساعة على حسابه، مع دفع مؤجّل. خسارة الدفعة السيئة يتحمّلها الموزّع.',

      'how.kicker': 'الحل',
      'how.title': 'كيف يعمل إمداد؟',
      'how.intro': 'ثلاث خطوات بسيطة، بدون تغيير طريقة عمل الموزّع.',
      'how.s1.title': 'حسّاس يرافق الشحنة',
      'how.s1.text': 'حسّاس صغير قابل لإعادة الاستخدام يسجّل الحرارة والوقت من القطف حتى التسليم، بما في ذلك الانتظار على الحواجز.',
      'how.s2.title': 'نموذج تعلّم آلي يقدّر العمر المتبقي',
      'how.s2.text': 'نموذج متخصص يحلّل الحرارة ومدة الرحلة وتأخير الحواجز ونوع المنتج ليقدّر الأيام المتبقية لكل دفعة. اخترنا نموذجًا متخصصًا بدل نموذج لغوي عام لتبقى التكلفة شبه معدومة.',
      'how.s3.title': 'توصية على واتساب',
      'how.s3.text': 'يصل الموزّع رسالة: كم باقي من عمر الدفعة، ولأي زبون يبعتها — مطعم، بقالة أو سوبرماركت.',
      'how.inspired': 'مستوحى من Zest Fresh (الولايات المتحدة)، ومُكيّف لواقع فلسطين: الحواجز، الشاحنات غير المبرّدة، والموزّعين الصغار.',

      'calc.kicker': 'عرض تجريبي 1',
      'calc.title': 'حاسبة العمر المتبقي للدفعة',
      'calc.intro': 'أدخل تفاصيل الرحلة. "الحسّاس الافتراضي" يقدّر حرارة داخل الشاحنة من حرارة الخارج، ثم يحسب النموذج كم استهلكت كل مرحلة من عمر الدفعة.',
      'calc.product': 'المنتج',
      'calc.quality': 'الجودة الأولية',
      'calc.qualityHint': 'بدلًا من فحص الصورة',
      'calc.hoursBefore': 'ساعات من القطف حتى التحميل',
      'calc.outsideTemp': 'حرارة الخارج (°C)',
      'calc.drivingHours': 'ساعات القيادة',
      'calc.checkpoint': 'الحاجز',
      'calc.delayHours': 'ساعات الانتظار',
      'calc.sampleNote': 'قيم التأخير الافتراضية أمثلة توضيحية، ويمكنك تعديلها.',
      'calc.inSun': 'هل وقفت الشاحنة تحت الشمس أثناء الانتظار؟',
      'calc.yes': 'نعم',
      'calc.no': 'لا',
      'calc.truck': 'نوع الشاحنة',
      'calc.truckClosed': 'مغلقة غير مبرّدة',
      'calc.truckCovered': 'مفتوحة مع غطاء',
      'calc.remaining': 'العمر المتبقي المقدَّر',
      'calc.days': 'يوم',
      'calc.of': 'من أصل {start} يوم في البداية',
      'calc.recommend': 'الزبون المقترح',
      'calc.chartTitle': 'العمر المُستهلَك في كل مرحلة (أيام)',
      'calc.chartAria': 'رسم بياني لعدد الأيام المستهلكة في كل مرحلة',
      'calc.tempLine': '{temp}°C · {hours} س',
      'calc.shade': 'لو انتظرت الشاحنة في الظل، كان العمر المتبقي <strong>{days} يوم</strong> (+{diff}).',
      'calc.shadeSame': 'الشاحنة انتظرت في الظل — هذا أفضل سيناريو للانتظار.',
      'calc.disclaimer': 'تقدير بنموذج علمي مبسّط وقيم توضيحية.',
      'calc.modelLink': 'كيف يعمل النموذج؟',

      'product.tomato': 'بندورة',
      'product.cucumber': 'خيار',
      'product.pepper': 'فلفل حلو',
      'product.grapes': 'عنب',
      'product.lettuce': 'خس',
      'product.strawberry': 'فراولة',

      'quality.excellent': 'ممتازة',
      'quality.good': 'جيدة',
      'quality.fair': 'متوسطة',

      'checkpoint.hamra': 'الحمرا (2 س)',
      'checkpoint.tayasir': 'تياسير (1.5 س)',
      'checkpoint.container': 'الكونتينر / وادي النار (1 س)',
      'checkpoint.other': 'حاجز آخر (1 س)',
      'checkpointName.hamra': 'الحمرا',
      'checkpointName.tayasir': 'تياسير',
      'checkpointName.container': 'الكونتينر / وادي النار',
      'checkpointName.other': 'حاجز آخر',

      'stage.beforeLoading': 'قبل التحميل',
      'stage.driving': 'القيادة',
      'stage.checkpoint': 'الانتظار على الحاجز',

      'cat.red': 'بيع اليوم',
      'cat.yellow': '⁦2–3⁩ أيام',
      'cat.green': '4+ أيام',
      'rec.red': 'مطاعم / الحسبة المركزية',
      'rec.yellow': 'بقالات صغيرة',
      'rec.green': 'سوبرماركت / محافظات بعيدة',

      'alloc.kicker': 'عرض تجريبي 2',
      'alloc.title': 'توزيع الدفعات على الزبائن',
      'alloc.intro': 'خوارزمية FEFO (الأقرب انتهاءً يخرج أولًا): ترتّب الدفعات حسب العمر المتبقي، وتعطي كل دفعة للزبون صاحب أطول مدة تخزين تستطيع الدفعة تحمّلها.',
      'alloc.batches': 'الدفعات',
      'alloc.customers': 'الزبائن',
      'alloc.product': 'المنتج',
      'alloc.days': 'الأيام المتبقية',
      'alloc.customerName': 'الزبون',
      'alloc.need': 'مدة التخزين (أيام)',
      'alloc.addBatch': '+ إضافة دفعة',
      'alloc.addCustomer': '+ إضافة زبون',
      'alloc.addFromDemo': '+ أضف دفعة الحاسبة',
      'alloc.reset': 'استعادة الأمثلة',
      'alloc.delete': 'حذف',
      'alloc.deleteBatch': 'حذف الدفعة {n}',
      'alloc.deleteCustomer': 'حذف الزبون {name}',
      'alloc.batchN': 'دفعة {n}',
      'alloc.result': 'نتيجة التوزيع',
      'alloc.col.order': '#',
      'alloc.col.batch': 'الدفعة',
      'alloc.col.remaining': 'المتبقي',
      'alloc.col.sendTo': 'ابعتها لـ',
      'alloc.col.spare': 'هامش',
      'alloc.sellToday': 'بيع اليوم في الحسبة المركزية / بخصم',
      'alloc.daysShort': '{d} يوم',
      'alloc.summary': 'بدون توزيع ذكي، كانت <strong>{x}</strong> من أصل {n} دفعات ستصل إلى زبون يخزّنها أطول من عمرها المتبقي.',
      'alloc.summaryNone': 'حتى بدون توزيع ذكي، لا توجد دفعات كانت ستصل لزبون يخزّنها أطول من عمرها — لكن FEFO يحافظ على الدفعات الطويلة للزبائن البعيدين.',
      'alloc.baselineNote': 'المقارنة تفترض توزيعًا عشوائيًا بترتيب الوصول على قائمة الزبائن.',
      'alloc.empty': 'أضف دفعة وزبونًا واحدًا على الأقل.',
      'alloc.sampleNote': 'قيم توضيحية قابلة للتعديل.',
      'cust.restaurant': 'مطعم',
      'cust.grocery': 'بقالة',
      'cust.supermarket': 'سوبرماركت',
      'cust.new': 'زبون جديد',

      'wa.kicker': 'معاينة',
      'wa.title': 'الرسالة التي تصل الموزّع',
      'wa.intro': 'تتحدّث مباشرة مع الحاسبة أعلاه، وباللغة المختارة.',
      'wa.contact': 'إمداد',
      'wa.status': 'حساب تجاري',
      'wa.today': 'اليوم',
      'wa.inputPlaceholder': 'رسالة',
      'wa.msg.header': '📦 *إمداد* | تقرير دفعة',
      'wa.msg.product': '{emoji} {product} — جودة {quality}',
      'wa.msg.remaining': '⏳ العمر المتبقي: *{days} يوم* {dot} ({cat})',
      'wa.msg.checkpoint': '🌡️ حرارة الشاحنة أثناء الانتظار ({cp}): حوالي {temp}°C لمدة {hours} س',
      'wa.msg.recommend': '✅ التوصية: ابعتها لـ *{rec}*',
      'wa.msg.shade': '💡 لو انتظرت الشاحنة بالظل كان ضلّ {days} يوم.',
      'wa.msg.footer': 'رد بـ 1 لتأكيد التوزيع، أو 2 لتفاصيل الرحلة.',

      'team.kicker': 'الفريق',
      'team.title': 'الفريق وراء إمداد',
      'team.aram': 'آرام عودة',
      'team.eman': 'إيمان الجلاد',
      'team.rushdi': 'رشدي الجلاد',
      'team.melissa': 'ميليسا عودة',
      'team.waseem': 'وسيم يحيى',
      'role.research': 'البحث',
      'role.design': 'تصميم UI/UX',
      'role.qa': 'الاختبار وضمان الجودة (QA)',
      'role.business': 'الأعمال والتسويق',
      'role.mvp': 'تطوير النموذج الأولي',

      'customer.kicker': 'لمن إمداد؟',
      'customer.title': 'موزّعو الجملة الصغار والمتوسطون',
      'customer.intro': 'موزّعو الخضار والفواكه بالجملة في الضفة الغربية الذين يملكون البضاعة التي يبيعونها، وينقلونها بشاحنات غير مبرّدة عبر الحواجز (مثلًا من الأغوار إلى الخليل ونابلس ورام الله). هم من يشعر بالخسارة مباشرة: عقود التوريد تحمّلهم كلفة التالف، بينما يحوّل وكلاء العمولة خسائرهم إلى المزارعين.',
      'persona.name': 'أبو خالد، 45 سنة',
      'persona.role': 'موزّع خضار بالجملة، الخليل',
      'persona.tag': 'شخصية توضيحية',
      'persona.contextLabel': 'السياق',
      'persona.context': 'يشتري البندورة والخيار من الأغوار وينقلها بشاحنات غير مبرّدة عبر حواجز مثل الحمرا. يورّد يوميًا للمطاعم والبقالات الصغيرة والسوبرماركت.',
      'persona.painsLabel': 'نقاط الألم',
      'persona.pains': 'لا يعرف أي دفعة تضررت من الحرارة والتأخير. البضاعة التالفة ترجع كمرتجعات وخصومات، ويخسر زبائن وصلتهم بضاعة سيئة.',
      'persona.motivationsLabel': 'الدوافع',
      'persona.motivations': 'يريد تقليل الخسائر، والحفاظ على ثقة زبائنه، والحصول على أفضل سعر لكل دفعة.',

      'ideas.kicker': 'أفكار درسناها',
      'ideas.title': 'لماذا تتبّع العمر المتبقي؟',
      'ideas.intro': 'درسنا ثلاث أفكار بجدية قبل أن نختار.',
      'ideas.setAside': 'استُبعدت',
      'ideas.chosen': 'اخترناها ✓',
      'ideas.i1.title': 'شاحنات مبرّدة مشتركة',
      'ideas.i1.text': '<strong>قد تنجح:</strong> تمنع التلف الحراري من مصدره.<br><strong>استبعدناها:</strong> تكلفة عالية، وصعوبة التنسيق بين التجار، ولا تحلّ مشكلة التأخير الطويل على الحواجز.',
      'ideas.i2.title': 'تطبيق تنبيهات الحواجز للسائقين',
      'ideas.i2.text': '<strong>قد ينجح:</strong> يساعد السائقين على تجنّب الحواجز المغلقة أو المزدحمة.<br><strong>استبعدناه:</strong> التأخير غالبًا لا مفرّ منه، ولا يخبر التاجر بما حدث للبضاعة أو لوين يبعتها.',
      'ideas.i3.title': 'تتبّع العمر المتبقي والتوزيع الذكي',
      'ideas.i3.text': 'مستوحى من Zest Fresh (الولايات المتحدة)، التي أثبتت أن دفعات قُطفت بنفس اليوم قد تختلف في عمرها المتبقي، وأن توزيعها حسب العمر يقلّل الهدر. مُكيّف لفلسطين: شاحنات غير مبرّدة، حواجز، وموزّعون صغار، وبتكلفة منخفضة بفضل حسّاس قابل لإعادة الاستخدام ونموذج متخصص.',

      'pilot.kicker': 'الجدوى',
      'pilot.title': 'تجربة صغيرة وبتكلفة منخفضة',
      'pilot.intro': 'الهدف: تقليل التلف والمرتجعات والخصومات بإرسال كل دفعة للزبون الذي سيبيعها قبل أن تتلف، فنحمي دخل الموزّع وعلاقته بزبائنه ونقلّل هدر الطعام.',
      'pilot.s1': 'حسّاسات قابلة لإعادة الاستخدام تتنقّل بين الشاحنات',
      'pilot.s2': 'موزّعين في التجربة الأولى',
      'pilot.s3': 'رحلة حقيقية لتدريب أول نسخة من النموذج',
      'pilot.s4': 'تطبيقات جديدة: التوصيات على واتساب',
      'pilot.assumptionsTitle': 'الافتراضات الأساسية التي سنختبرها',
      'pilot.a1': 'الموزّعون مستعدون لدفع اشتراك شهري صغير إذا قلّل النظام خسائرهم.',
      'pilot.a2': 'السائقون سيحملون الحسّاس ويعيدونه بعد كل رحلة.',
      'pilot.a3': '⁦10–20⁩ رحلة كافية لتدريب نموذج دقيق بما يكفي لتصنيف الدفعات إلى ثلاث فئات: بيع اليوم، ⁦2–3⁩ أيام، 4+ أيام.',
      'pilot.a4': 'لدى الموزّعين زبائن بمدد تخزين مختلفة، فيصنع التوزيع حسب العمر فرقًا حقيقيًا.',
      'pilot.a5': 'التجار سيتبعون التوصيات ويبلّغون عمّا حدث لكل دفعة، فيتحسّن النموذج باستمرار.',

      'footer.name': 'إمداد، تحدي التجارة الذكية 2026',
      'footer.repo': 'الكود على GitHub',
      'footer.disclaimer': 'تقديرات العرض التجريبي تستخدم نموذجًا علميًا مبسّطًا وقيمًا توضيحية. سيُعايَر المنتج الحقيقي ببيانات حسّاسات من رحلات فلسطينية.'
    },

    en: {
      'meta.title': 'Imdad | Know how much life each batch has left',
      'meta.description': 'Imdad: a sensor travels with each shipment and an ML model estimates each produce batch\'s remaining shelf life, then recommends the right customer on WhatsApp. MVP, Smart Commerce Challenge 2026.',
      'skip': 'Skip to content',
      'brand': 'Imdad',
      'nav.problem': 'Problem',
      'nav.customer': 'Customer',
      'nav.how': 'How it works',
      'nav.demo': 'Calculator',
      'nav.allocation': 'Allocation',
      'nav.whatsapp': 'WhatsApp',
      'nav.team': 'Team',
      'nav.menu': 'Menu',
      'lang.toggle': 'العربية',
      'lang.toggleLabel': 'التبديل إلى العربية',

      'hero.badge': 'Smart Commerce Challenge 2026 · Logistics & Supply Chain',
      'hero.tagline': 'Know how much life each batch has left, and where to send it.',
      'hero.subtitle': 'A reusable sensor travels with each produce shipment, and a machine learning model estimates every batch\'s remaining shelf life and recommends the right customer, straight to WhatsApp.',
      'hero.cta': 'Try the demo',
      'hero.ctaSecondary': 'How it works',
      'hero.card.title': 'Tomato batch · Hamra',
      'hero.card.remaining': 'Remaining shelf life',
      'hero.card.days': 'days',
      'hero.card.send': 'Send to: supermarkets / distant governorates',
      'hero.card.note': 'Illustrative example',

      'problem.kicker': 'The problem',
      'problem.title': 'Harvested the same day, different lives left',
      'problem.intro': 'Wholesale distributors in the West Bank move fruit and vegetables in unrefrigerated trucks through checkpoints. Heat and delays damage batches invisibly.',
      'problem.c1.title': 'Hidden heat damage',
      'problem.c1.text': 'A batch looks fine at loading, but hours of heat inside a closed box quietly consume days of its shelf life.',
      'problem.c2.title': 'Checkpoint delays',
      'problem.c2.text': 'Waiting at checkpoints like Hamra and Tayasir, sometimes in the sun, gives every batch a different remaining life, even if picked the same morning.',
      'problem.c3.title': 'The distributor pays for returns',
      'problem.c3.text': 'Near-spoiled batches go to customers who store them for days and come back as returns and deductions. Supply contracts make the distributor replace spoiled goods within 24 hours at their own cost, and bad batches lose customers.',
      'problem.statementLabel': 'Problem statement',
      'problem.statement': 'Wholesale produce distributors in Palestine need a way to match each batch to the right customer based on its remaining shelf life, because checkpoint delays and heat cause hidden damage that only shows up after delivery.',
      'problem.sources': 'Sources',
      'problem.f1': '<strong>MAS, Palestine Economic Policy Research Institute, Mar 2025:</strong> 14 checkpoints on key routes, with an average delay of 42 minutes per checkpoint. Delays are routine and unpredictable.',
      'problem.f2': '<strong>PNN news report, Jul 2025</strong> (interview with Hebron vegetable merchant Shadwan Abu Sneineh): waits of 1–4 hours at checkpoints, including Hamra. Produce quality is ruined, and some loads spoil fully inside closed trucks.',
      'problem.f3': '<strong>Cappers et al., Wageningen University & Univ. of Milan, 2013 (peer-reviewed):</strong> heat and time inside unrefrigerated trucks caused 30–50% tomato losses. The damage builds up invisibly and can be predicted from weather data.',
      'problem.f4': '<strong>Supply tender, Al-Ghad Al-Mushriq, Aug 2026:</strong> the supplier must replace spoiled goods within 24 hours at its own cost, and payment is deferred. The loss from a bad batch falls on the distributor.',

      'how.kicker': 'The solution',
      'how.title': 'How Imdad works',
      'how.intro': 'Three simple steps, without changing how the distributor works.',
      'how.s1.title': 'A sensor travels with the shipment',
      'how.s1.text': 'A small, reusable sensor logs temperature and time from harvest to delivery, including checkpoint waits.',
      'how.s2.title': 'An ML model estimates remaining shelf life',
      'how.s2.text': 'A specialized model analyzes temperature, trip duration, checkpoint delays and product type to estimate how many days each batch has left. We chose a specialized model over a general language model to keep costs low.',
      'how.s3.title': 'Recommendation on WhatsApp',
      'how.s3.text': 'The distributor gets a message: how much life the batch has left and which customer to send it to: restaurant, grocery or supermarket.',
      'how.inspired': 'Inspired by Zest Fresh (USA), adapted to Palestine: checkpoints, unrefrigerated trucks and small distributors.',

      'calc.kicker': 'Demo 1',
      'calc.title': 'Batch shelf-life calculator',
      'calc.intro': 'Enter the trip details. A "virtual sensor" estimates the temperature inside the truck from the outside temperature, then the model calculates how much shelf life each stage consumed.',
      'calc.product': 'Product',
      'calc.quality': 'Initial quality',
      'calc.qualityHint': 'Stands in for a photo check',
      'calc.hoursBefore': 'Hours from harvest to loading',
      'calc.outsideTemp': 'Outside temperature (°C)',
      'calc.drivingHours': 'Driving hours',
      'calc.checkpoint': 'Checkpoint',
      'calc.delayHours': 'Delay hours',
      'calc.sampleNote': 'Default delays are sample values; you can edit them.',
      'calc.inSun': 'Parked in the sun while waiting?',
      'calc.yes': 'Yes',
      'calc.no': 'No',
      'calc.truck': 'Truck type',
      'calc.truckClosed': 'Closed, unrefrigerated',
      'calc.truckCovered': 'Open with cover',
      'calc.remaining': 'Estimated remaining shelf life',
      'calc.days': 'days',
      'calc.of': 'out of {start} days at the start',
      'calc.recommend': 'Recommended customer',
      'calc.chartTitle': 'Shelf life consumed per stage (days)',
      'calc.chartAria': 'Bar chart of days of shelf life consumed per stage',
      'calc.tempLine': '{temp}°C · {hours} h',
      'calc.shade': 'If the truck had waited in the shade, remaining shelf life would be <strong>{days} days</strong> (+{diff}).',
      'calc.shadeSame': 'The truck waited in the shade: that is already the best waiting scenario.',
      'calc.disclaimer': 'Estimate from a simplified scientific model with sample values.',
      'calc.modelLink': 'How does the model work?',

      'product.tomato': 'Tomato',
      'product.cucumber': 'Cucumber',
      'product.pepper': 'Bell pepper',
      'product.grapes': 'Grapes',
      'product.lettuce': 'Lettuce',
      'product.strawberry': 'Strawberry',

      'quality.excellent': 'Excellent',
      'quality.good': 'Good',
      'quality.fair': 'Fair',

      'checkpoint.hamra': 'Hamra (2 h)',
      'checkpoint.tayasir': 'Tayasir (1.5 h)',
      'checkpoint.container': 'Container / Wadi al-Nar (1 h)',
      'checkpoint.other': 'Other (1 h)',
      'checkpointName.hamra': 'Hamra',
      'checkpointName.tayasir': 'Tayasir',
      'checkpointName.container': 'Container / Wadi al-Nar',
      'checkpointName.other': 'checkpoint',

      'stage.beforeLoading': 'Before loading',
      'stage.driving': 'Driving',
      'stage.checkpoint': 'Checkpoint wait',

      'cat.red': 'Sell today',
      'cat.yellow': '2–3 days',
      'cat.green': '4+ days',
      'rec.red': 'Restaurants / central market',
      'rec.yellow': 'Small groceries',
      'rec.green': 'Supermarkets / distant governorates',

      'alloc.kicker': 'Demo 2',
      'alloc.title': 'Batch allocation',
      'alloc.intro': 'FEFO (First Expired, First Out): batches are sorted by remaining life, and each one goes to the customer with the longest storage need it can still satisfy.',
      'alloc.batches': 'Batches',
      'alloc.customers': 'Customers',
      'alloc.product': 'Product',
      'alloc.days': 'Days left',
      'alloc.customerName': 'Customer',
      'alloc.need': 'Storage (days)',
      'alloc.addBatch': '+ Add batch',
      'alloc.addCustomer': '+ Add customer',
      'alloc.addFromDemo': '+ Add calculator batch',
      'alloc.reset': 'Reset samples',
      'alloc.delete': 'Delete',
      'alloc.deleteBatch': 'Delete batch {n}',
      'alloc.deleteCustomer': 'Delete customer {name}',
      'alloc.batchN': 'Batch {n}',
      'alloc.result': 'Allocation result',
      'alloc.col.order': '#',
      'alloc.col.batch': 'Batch',
      'alloc.col.remaining': 'Left',
      'alloc.col.sendTo': 'Send to',
      'alloc.col.spare': 'Spare',
      'alloc.sellToday': 'Sell today at the central market / discount',
      'alloc.daysShort': '{d} d',
      'alloc.summary': 'Without allocation, <strong>{x}</strong> of {n} batches would have reached a customer who stores longer than their remaining life.',
      'alloc.summaryNone': 'Even without allocation, no batch would have reached a customer who stores longer than its remaining life, but FEFO still keeps long-life batches for distant customers.',
      'alloc.baselineNote': 'Baseline assumes blind dispatch in arrival order, rotating through the customer list.',
      'alloc.empty': 'Add at least one batch and one customer.',
      'alloc.sampleNote': 'Sample values, editable.',
      'cust.restaurant': 'Restaurant',
      'cust.grocery': 'Grocery',
      'cust.supermarket': 'Supermarket',
      'cust.new': 'New customer',

      'wa.kicker': 'Preview',
      'wa.title': 'The message the distributor receives',
      'wa.intro': 'Updates live from the calculator above, in the selected language.',
      'wa.contact': 'Imdad',
      'wa.status': 'Business account',
      'wa.today': 'Today',
      'wa.inputPlaceholder': 'Message',
      'wa.msg.header': '📦 *Imdad* | Batch report',
      'wa.msg.product': '{emoji} {product}, {quality} quality',
      'wa.msg.remaining': '⏳ Remaining shelf life: *{days} days* {dot} ({cat})',
      'wa.msg.checkpoint': '🌡️ Truck temperature while waiting ({cp}): ~{temp}°C for {hours} h',
      'wa.msg.recommend': '✅ Recommendation: send to *{rec}*',
      'wa.msg.shade': '💡 Waiting in the shade would have left {days} days.',
      'wa.msg.footer': 'Reply 1 to confirm, or 2 for trip details.',

      'team.kicker': 'Team',
      'team.title': 'The team behind Imdad',
      'team.aram': 'Aram Odeh',
      'team.eman': 'Eman Jallad',
      'team.rushdi': 'Rushdi Jallad',
      'team.melissa': 'Melissa Odeh',
      'team.waseem': 'Waseem Yahya',
      'role.research': 'Research',
      'role.design': 'UI/UX Design',
      'role.qa': 'Testing & QA',
      'role.business': 'Business & Marketing',
      'role.mvp': 'MVP Development',

      'customer.kicker': 'Who it is for',
      'customer.title': 'Small and medium wholesale distributors',
      'customer.intro': 'Wholesale produce distributors in the West Bank who own the goods they sell and move them in unrefrigerated trucks through checkpoints (e.g. Jordan Valley to Hebron, Nablus and Ramallah). They feel the pain most directly: supply contracts make them bear the cost of spoiled goods, while commission agents pass their losses on to farmers.',
      'persona.name': 'Abu Khaled, 45',
      'persona.role': 'Wholesale produce distributor, Hebron',
      'persona.tag': 'Example persona',
      'persona.contextLabel': 'Context',
      'persona.context': 'Buys tomatoes and cucumbers from the Jordan Valley and moves them in unrefrigerated trucks through checkpoints like Hamra. Supplies restaurants, small groceries and supermarkets daily.',
      'persona.painsLabel': 'Pain points',
      'persona.pains': 'Can\'t tell which batches were damaged by heat and delays. Spoiled goods come back as returns and deductions, and he loses customers who received bad produce.',
      'persona.motivationsLabel': 'Motivations',
      'persona.motivations': 'Wants to cut losses, keep his customers\' trust, and get the best price for each batch.',

      'ideas.kicker': 'Ideas we considered',
      'ideas.title': 'Why shelf-life tracking?',
      'ideas.intro': 'We seriously considered three ideas before choosing one.',
      'ideas.setAside': 'Set aside',
      'ideas.chosen': 'Chosen ✓',
      'ideas.i1.title': 'Shared refrigerated trucks',
      'ideas.i1.text': '<strong>Could work:</strong> prevents heat damage at the source.<br><strong>Set aside:</strong> high cost, hard to coordinate between traders, and it doesn\'t solve long checkpoint delays.',
      'ideas.i2.title': 'Checkpoint alert app for drivers',
      'ideas.i2.text': '<strong>Could work:</strong> drivers could avoid closed or crowded checkpoints.<br><strong>Set aside:</strong> delays are often unavoidable, and it doesn\'t tell the trader what happened to the goods or where to send them.',
      'ideas.i3.title': 'Shelf-life tracking and smart allocation',
      'ideas.i3.text': 'Inspired by Zest Fresh (USA), which showed that batches harvested the same day can have different remaining shelf life, and that allocating by shelf life reduces waste. Adapted to Palestine: unrefrigerated trucks, checkpoint delays and small distributors, kept affordable with a reusable sensor and a specialized model.',

      'pilot.kicker': 'Feasibility',
      'pilot.title': 'A small, affordable pilot',
      'pilot.intro': 'Goal: reduce spoilage, returns and deductions by sending each batch to the customer who will sell it before it spoils, protecting the distributor\'s income and customer relationships and reducing food waste.',
      'pilot.s1': 'reusable sensors rotated between trucks',
      'pilot.s2': 'distributors in the first pilot',
      'pilot.s3': 'real trips to train the first model',
      'pilot.s4': 'new apps: recommendations arrive on WhatsApp',
      'pilot.assumptionsTitle': 'Key assumptions we will test',
      'pilot.a1': 'Distributors are willing to pay a small monthly fee if the system reduces their losses.',
      'pilot.a2': 'Drivers will carry the sensor and return it after each trip.',
      'pilot.a3': '10–20 trips are enough to train a model accurate enough to sort batches into three groups: sell today, 2–3 days, or 4+ days.',
      'pilot.a4': 'Distributors have customers with different storage times, so allocating by shelf life makes a real difference.',
      'pilot.a5': 'Traders will follow the recommendations and report what happened to each batch, so the model keeps improving.',

      'footer.name': 'Imdad, Smart Commerce Challenge 2026',
      'footer.repo': 'Source on GitHub',
      'footer.disclaimer': 'Demo estimates use a simplified scientific model with sample values. The real product will be calibrated with sensor data from Palestinian trips.'
    }
  };

  var current = DEFAULT_LANG;

  /** Read the saved language; localStorage can throw (private mode, disabled storage). */
  function loadLang() {
    try {
      var saved = global.localStorage.getItem(STORAGE_KEY);
      if (saved && translations[saved]) return saved;
    } catch (e) { /* storage unavailable: fall back to default */ }
    return DEFAULT_LANG;
  }

  function saveLang(lang) {
    try { global.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  /** Translate a key, filling {placeholders} from params. Falls back to English, then the key. */
  function t(key, params) {
    var str = translations[current][key];
    if (str == null) str = translations.en[key];
    if (str == null) return key;
    if (params) {
      str = str.replace(/\{(\w+)\}/g, function (m, name) {
        return params[name] != null ? params[name] : m;
      });
    }
    return str;
  }

  /** Apply translations to every tagged element under `root`. */
  function apply(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    root.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });
  }

  /** Switch language: updates <html lang/dir>, title, meta tags and all text. */
  function setLang(lang) {
    if (!translations[lang]) lang = DEFAULT_LANG;
    current = lang;
    var html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('meta.title');
    apply(document);
    saveLang(lang);
  }

  function getLang() { return current; }

  current = loadLang();

  global.ImdadI18n = {
    translations: translations,
    t: t,
    apply: apply,
    setLang: setLang,
    getLang: getLang
  };
})(window);
