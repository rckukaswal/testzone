class FileManager {
    constructor() {
        this.files = JSON.parse(localStorage.getItem('javaFiles')) || [];
        this.init();
    }

    init() {
        this.renderFiles();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.previewFiles(e.target.files);
        });
    }

    previewFiles(fileList) {
        // Preview functionality can be added here
        console.log('Files selected:', fileList);
    }

    uploadFiles() {
        const fileInput = document.getElementById('fileInput');
        const category = document.getElementById('categorySelect').value;
        
        if (fileInput.files.length === 0) {
            this.showToast('Please select at least one file', 'error');
            return;
        }

        Array.from(fileInput.files).forEach(file => {
            if (file.name.endsWith('.java')) {
                this.addFileToStorage(file, category);
            } else {
                this.showToast(`Skipped ${file.name}: Only .java files allowed`, 'warning');
            }
        });

        fileInput.value = '';
        this.renderFiles();
        this.showToast('Files uploaded successfully!', 'success');
    }

    addFileToStorage(file, category) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const fileData = {
                id: Date.now() + Math.random(),
                name: file.name,
                content: e.target.result,
                category: category,
                size: this.formatFileSize(file.size),
                lastModified: new Date().toLocaleDateString(),
                uploadDate: new Date().toISOString()
            };

            this.files.push(fileData);
            localStorage.setItem('javaFiles', JSON.stringify(this.files));
        };

        reader.readAsText(file);
    }

    renderFiles() {
        const tbody = document.getElementById('fileTableBody');
        const noFilesMsg = document.getElementById('noFilesMessage');
        const fileCount = document.getElementById('fileCount');

        if (this.files.length === 0) {
            tbody.innerHTML = '';
            noFilesMsg.style.display = 'block';
            fileCount.textContent = '(0 files)';
            return;
        }

        noFilesMsg.style.display = 'none';
        fileCount.textContent = `(${this.files.length} files)`;

        tbody.innerHTML = this.files.map(file => `
            <tr>
                <td>${file.name}</td>
                <td>${file.category}</td>
                <td>${file.size}</td>
                <td>${file.lastModified}</td>
                <td class="actions">
                    <button onclick="fileManager.viewFile('${file.id}')" class="btn btn-sm">View</button>
                    <button onclick="fileManager.downloadFile('${file.id}')" class="btn btn-sm btn-primary">Download</button>
                    <button onclick="fileManager.deleteFile('${file.id}')" class="btn btn-sm btn-danger">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    viewFile(fileId) {
        const file = this.files.find(f => f.id == fileId);
        if (!file) return;

        document.getElementById('modalTitle').textContent = file.name;
        document.getElementById('fileContent').textContent = file.content;
        document.getElementById('fileModal').style.display = 'block';
        
        this.highlightCode(document.getElementById('fileContent'));
    }

    downloadFile(fileId) {
        const file = this.files.find(f => f.id == fileId);
        if (!file) return;

        const blob = new Blob([file.content], { type: 'text/java' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    deleteFile(fileId) {
        if (!confirm('Are you sure you want to delete this file?')) return;

        this.files = this.files.filter(f => f.id != fileId);
        localStorage.setItem('javaFiles', JSON.stringify(this.files));
        this.renderFiles();
        this.showToast('File deleted successfully!', 'success');
    }

    searchFiles() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredFiles = this.files.filter(file => 
            file.name.toLowerCase().includes(searchTerm) ||
            file.category.toLowerCase().includes(searchTerm)
        );

        this.renderFilteredFiles(filteredFiles);
    }

    renderFilteredFiles(filteredFiles) {
        const tbody = document.getElementById('fileTableBody');
        const noFilesMsg = document.getElementById('noFilesMessage');

        if (filteredFiles.length === 0) {
            tbody.innerHTML = '';
            noFilesMsg.style.display = 'block';
            noFilesMsg.innerHTML = '<p>No files match your search criteria.</p>';
            return;
        }

        noFilesMsg.style.display = 'none';
        tbody.innerHTML = filteredFiles.map(file => `
            <tr>
                <td>${file.name}</td>
                <td>${file.category}</td>
                <td>${file.size}</td>
                <td>${file.lastModified}</td>
                <td class="actions">
                    <button onclick="fileManager.viewFile('${file.id}')" class="btn btn-sm">View</button>
                    <button onclick="fileManager.downloadFile('${file.id}')" class="btn btn-sm btn-primary">Download</button>
                    <button onclick="fileManager.deleteFile('${file.id}')" class="btn btn-sm btn-danger">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    highlightCode(element) {
        const code = element.textContent;
        const keywords = ['class', 'public', 'private', 'protected', 'static', 'void', 'int', 'String', 
                         'boolean', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'new'];
        
        let highlighted = code;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
        });

        // Highlight strings
        highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
        
        // Highlight comments
        highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');

        element.innerHTML = highlighted;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Modal functions
function closeModal() {
    document.getElementById('fileModal').style.display = 'none';
}

function downloadCurrentFile() {
    const fileName = document.getElementById('modalTitle').textContent;
    const fileContent = document.getElementById('fileContent').textContent;
    
    const blob = new Blob([fileContent], { type: 'text/java' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('fileModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize file manager
const fileManager = new FileManager();

// Global functions for HTML onclick attributes
function uploadFiles() {
    fileManager.uploadFiles();
}

function searchFiles() {
    fileManager.searchFiles();
}
