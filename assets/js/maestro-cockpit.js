'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ===========================================
    // 1. الثوابت وإعدادات الواجهة
    // ===========================================
    const AVAILABLE_COMPONENTS = [
        'ARTICLE_HERO', 'PRODUCT_REVIEW_HERO', 'BREADCRUMB', 'HOW_TO_GUIDE',
        'RECIPE_CARD', 'FAQ_ACCORDION', 'EVENT_CARD', 'ORGANIZATION_CARD', 'FINAL_CTA'
    ];

    // ===========================================
    // 2. جلب العناصر من الواجهة (DOM Caching)
    // ===========================================
    const rawContentInput = document.getElementById('rawContentInput');
    const assetManifestInput = document.getElementById('assetManifestInput');
    const generatedPromptOutput = document.getElementById('generatedPromptOutput');
    const generateBtn = document.getElementById('generateBtn');
    const copyPromptBtn = document.getElementById('copyPromptBtn');
    const clearBtn = document.getElementById('clearBtn');
    const dnaContainer = document.getElementById('dna-container');
    const generateBtnSpinner = document.getElementById('generateBtnSpinner');
    const generateBtnIcon = document.getElementById('generateBtnIcon');

    // ===========================================
    // 3. الدوال الوظيفية
    // ===========================================

    /**
     * يقوم بإنشاء مربعات الاختيار للمكونات بشكل ديناميكي
     */
    function populateDnaSelector() {
        let html = '';
        AVAILABLE_COMPONENTS.forEach(component => {
            html += `
                <div class="form-check form-switch mb-2">
                    <input class="form-check-input component-checkbox" type="checkbox" role="switch" id="check-${component}" value="${component}">
                    <label class="form-check-label" for="check-${component}">${component.replace(/_/g, ' ')}</label>
                </div>
            `;
        });
        dnaContainer.innerHTML = html;
    }

    /**
     * الدالة الرئيسية التي تدير عملية التوليد
     */
    function handleGeneration() {
        const rawContent = rawContentInput.value;
        if (!rawContent.trim()) {
            showToast('الرجاء إدخال المحتوى الخام أولاً.', 'warning');
            return;
        }

        const assetManifest = assetManifestInput.value;
        
        const selectedComponents = Array.from(document.querySelectorAll('.component-checkbox:checked'))
                                        .map(cb => cb.value);

        if (selectedComponents.length === 0) {
            showToast('الرجاء اختيار مكون واحد على الأقل من قائمة TEMPLATE_DNA.', 'warning');
            return;
        }
        
        setLoadingState(true);
        
        // محاكاة تأخير بسيط كما لو أننا نتصل بـ API
        setTimeout(() => {
            const finalPrompt = GenesisProtocolGenerator.generate({
                rawContent: rawContent,
                assetManifest: assetManifest,
                templateDnaArray: selectedComponents
            });

            if (finalPrompt) {
                generatedPromptOutput.value = finalPrompt;
                copyPromptBtn.disabled = false;
                showToast('تم توليد بروتوكول Genesis بنجاح!', 'success');
            } else {
                showToast('حدث خطأ أثناء توليد البروتوكول.', 'danger');
            }
            setLoadingState(false);
        }, 500); // 0.5 ثانية تأخير للمحاكاة
    }

    /**
     * يقوم بمسح جميع المدخلات والمخرجات
     */
    function clearAll() {
        rawContentInput.value = '';
        assetManifestInput.value = '';
        generatedPromptOutput.value = '';
        document.querySelectorAll('.component-checkbox').forEach(cb => cb.checked = false);
        copyPromptBtn.disabled = true;
        showToast('تم مسح جميع الحقول.', 'info');
        rawContentInput.focus();
    }

    /**
     * إدارة حالة التحميل للزر الرئيسي
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            generateBtn.disabled = true;
            generateBtnSpinner.style.display = 'inline-block';
            generateBtnIcon.style.display = 'none';
        } else {
            generateBtn.disabled = false;
            generateBtnSpinner.style.display = 'none';
            generateBtnIcon.style.display = 'inline-block';
        }
    }

    // ===========================================
    // 4. ربط الأحداث وتهيئة الواجهة
    // ===========================================
    populateDnaSelector(); // بناء مربعات الاختيار عند تحميل الصفحة
    generateBtn.addEventListener('click', handleGeneration);
    clearBtn.addEventListener('click', clearAll);

    copyPromptBtn.addEventListener('click', () => {
        if (generatedPromptOutput.value) {
            navigator.clipboard.writeText(generatedPromptOutput.value)
                .then(() => showToast('تم نسخ البروتوكول إلى الحافظة بنجاح.', 'success'))
                .catch(err => {
                    console.error('فشل النسخ:', err);
                    showToast('فشل نسخ البروتوكول.', 'danger');
                });
        }
    });
});