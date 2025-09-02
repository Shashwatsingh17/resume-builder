<template>
    <CustomButton @click="exportPdf" btn-type="primary" :disabled="isExporting" ref="exportButton">
        {{ isExporting ? 'Exporting...' : 'Export Resume PDF' }}
    </CustomButton>
</template>

<script>
import { gsap } from 'gsap';
import CustomButton from './CustomButton.vue';

export default {
    mounted() {
        try {
            this.initExportAnimations();
        } catch (error) {
            console.error('ExportPdf component mount error:', error);
        }
    },
    components: {
        CustomButton
    },
    props: {
        resumeFormat: String,
        resumeData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isExporting: false
        };
    },
    methods: {
        initExportAnimations() {
            gsap.fromTo(this.$refs.exportButton.$refs.button,
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        },
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
                
                // Temporarily ensure the name is visible in the resume
                const nameElement = resume.querySelector('.name');
                const titleElement = resume.querySelector('.title');
                
                if (nameElement && this.resumeData.name) {
                    nameElement.textContent = this.resumeData.name;
                }
                if (titleElement && this.resumeData.title) {
                    titleElement.textContent = this.resumeData.title;
                }
                
                // Force a layout recalculation
                resume.style.display = 'none';
                resume.offsetHeight; // Trigger reflow
                resume.style.display = '';
                
                // Wait a moment for the DOM to update
                await new Promise(resolve => setTimeout(resolve, 100));
                
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
                        scale: 3,
                        dpi: 300,
                        useCORS: true,
                        allowTaint: true
                    }
                };
                
                await html2pdf().set(pdfConfig).from(resume).save();
                
                // Animate success
                gsap.to(this.$refs.exportButton.$refs.button, {
                    scale: 1.1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
                
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