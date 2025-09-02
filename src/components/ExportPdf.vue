<template>
    <CustomButton @click="exportPdf" btn-type="primary" :disabled="isExporting">
        {{ isExporting ? 'Exporting...' : 'Export Resume PDF' }}
    </CustomButton>
</template>

<script>
import CustomButton from './CustomButton.vue';

export default {
    components: {
        CustomButton
    },
    props: {
        resumeFormat: String
    },
    data() {
        return {
            isExporting: false
        };
    },
    methods: {
        async exportPdf() {
            if (this.isExporting) return;
            
            try {
                this.isExporting = true;
                
                // Check if html2pdf is available
                if (typeof html2pdf === 'undefined') {
                    throw new Error('PDF export library not loaded. Please refresh the page and try again.');
                }
                
                const resume = document.getElementById('resume');
                if (!resume) {
                    throw new Error('Resume element not found');
                }
                
                const unit = this.resumeFormat === "a4" ? "mm" : "in";
                const pdfConfig = {
                    margin: [10, 10, 10, 10],
                    filename: 'resume.pdf',
                    jsPDF: { 
                        unit: unit,
                        format: this.resumeFormat,
                        orientation: 'portrait' 
                    },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true
                    }
                };
                
                await html2pdf().set(pdfConfig).from(resume).save();
                
            } catch (error) {
                console.error('PDF Export Error:', error);
                alert(`Failed to export PDF: ${error.message}`);
            } finally {
                this.isExporting = false;
            }
        }
    }
}
</script>