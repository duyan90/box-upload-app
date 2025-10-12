import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, BoxFile } from '../models';
import { STORAGE_KEYS } from '../shared/constants';
import { formatFileSize, getInitials } from '../shared/utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  error = '';
  accessToken = '';
  refreshToken = '';
  user: User | null = null;

  // File upload properties
  selectedFiles: File[] = [];
  isDragOver = false;
  isUploading = false;
  uploadErrorMessage: string | null = null;
  successMessage: string | null = null;
  uploadProgress = 0;
  
  // Individual file upload progress
  fileUploadProgress: Map<string, number> = new Map();
  currentUploadingFiles: string[] = [];

  // Uploaded files list
  uploadedFiles: BoxFile[] = [];
  isLoadingFiles = false;
  
  // Constants from environment
  readonly MAX_FILES = environment.upload.maxFiles;
  readonly MAX_FILE_SIZE = environment.upload.maxFileSize;

  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // Get tokens from URL query params
    this.route.queryParams.subscribe(params => {
      const error = params['error'];
      
      if (error) {
        this.error = `Authentication failed: ${error}`;
        this.isLoading = false;
        return;
      }

      this.accessToken = params['access_token'];
      this.refreshToken = params['refresh_token'];
      const userId = params['user_id'];
      const userName = params['user_name'];

      if (this.accessToken && userId) {
        console.log('💾 Saving tokens to localStorage...');
        
        // Store tokens FIRST using constants
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, this.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, this.refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
        localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);

        console.log('✅ Tokens saved successfully');

        // Set user info
        this.user = {
          id: userId,
          type: 'user',
          name: userName,
          login: userName,
        };

        this.isLoading = false;

        // Load uploaded files
        this.loadUploadedFiles();

        console.log('🧹 Cleaning URL (removing tokens)...');
        
        // Clean URL (remove tokens from URL for security)
        // Use replaceUrl to avoid triggering guards again
        this.router.navigate(['/dashboard'], { 
          queryParams: {},
          replaceUrl: true,
          skipLocationChange: false
        });
        
        console.log('✅ URL cleaned, staying on dashboard');
      } else {
        // Try to load from localStorage using constants
        const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        const storedUserName = localStorage.getItem(STORAGE_KEYS.USER_NAME);

        if (storedToken && storedUserId) {
          this.accessToken = storedToken;
          this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || '';
          this.user = {
            id: storedUserId,
            type: 'user',
            name: storedUserName || 'User',
            login: storedUserName || 'user@box.com',
          };
          this.isLoading = false;
          
          // Load uploaded files
          this.loadUploadedFiles();
        } else {
          this.error = 'No authentication data found';
          this.isLoading = false;
        }
      }
    });
  }

  logout(): void {
    // Clear stored tokens
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);

    // Redirect to login
    this.router.navigate(['/login']);
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  // File upload methods
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.addFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
      // Reset input value to allow selecting same file again
      input.value = '';
    }
  }

  private addFiles(files: File[]): void {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    const warnings: string[] = [];

    // Check if adding these files exceeds max limit
    const totalAfterAdd = this.selectedFiles.length + files.length;
    if (totalAfterAdd > this.MAX_FILES) {
      const availableSlots = this.MAX_FILES - this.selectedFiles.length;
      warnings.push(`⚠️ Maximum ${this.MAX_FILES} files allowed. Only ${availableSlots} slot(s) available.`);
    }

    // Validate each file
    files.forEach(file => {
      // Check max files limit
      if (this.selectedFiles.length + validFiles.length >= this.MAX_FILES) {
        warnings.push(`⚠️ Skipped: ${file.name} (max ${this.MAX_FILES} files)`);
        return;
      }

      // Check file size
      if (file.size > this.MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (${this.formatFileSize(file.size)})`);
      } else {
        validFiles.push(file);
      }
    });

    // Add valid files
    if (validFiles.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...validFiles];
      this.uploadErrorMessage = null;
      this.successMessage = null;
    }

    // Show warnings
    const allWarnings = [...warnings];
    if (invalidFiles.length > 0) {
      allWarnings.push(`⚠️ ${invalidFiles.length} file(s) exceed 100MB limit:\n${invalidFiles.join('\n')}`);
    }

    if (allWarnings.length > 0) {
      this.uploadErrorMessage = allWarnings.join('\n\n');
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  // Use utility function
  formatFileSize = formatFileSize;

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getVersionNumber(file: BoxFile): number {
    // Try multiple sources for version number
    if (file.file_version?.version_number) {
      return parseInt(file.file_version.version_number, 10);
    }
    if (file.sequence_id !== undefined && file.sequence_id !== null) {
      return parseInt(file.sequence_id, 10) + 1; // sequence_id is 0-based
    }
    if (file.etag) {
      return parseInt(file.etag, 10) + 1; // etag is also 0-based
    }
    return 1; // Default to v1
  }

  getProgressStatus(): string {
    if (this.uploadProgress < 30) return 'Initializing...';
    if (this.uploadProgress < 50) return 'Uploading...';
    if (this.uploadProgress < 80) return 'Processing...';
    if (this.uploadProgress < 100) return 'Finalizing...';
    return 'Done!';
  }

  // Use utility function
  getInitials = getInitials;

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response: any = await this.http.post('/api/box/refresh', { 
        refreshToken: this.refreshToken 
      }).toPromise();

      if (response.success) {
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;

        // Update localStorage
        localStorage.setItem('box_access_token', this.accessToken);
        localStorage.setItem('box_refresh_token', this.refreshToken);

        console.log('✅ Token refreshed successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to refresh token:', error);
      return false;
    }
  }

  uploadFiles(): void {
    if (!this.accessToken || this.selectedFiles.length === 0) {
      this.uploadErrorMessage = 'No files selected or authentication token missing.';
      return;
    }

    this.isUploading = true;
    this.uploadErrorMessage = null;
    this.successMessage = null;
    this.uploadProgress = 0;
    
    // Initialize progress for each file
    this.fileUploadProgress.clear();
    this.currentUploadingFiles = [];
    this.selectedFiles.forEach(file => {
      this.fileUploadProgress.set(file.name, 0);
    });

    // Upload files one by one
    this.uploadFilesSequentially(0);
  }

  private uploadFilesSequentially(index: number): void {
    if (index >= this.selectedFiles.length) {
      // All files uploaded
      this.isUploading = false;
      this.currentUploadingFiles = [];
      this.successMessage = `✅ Successfully uploaded ${this.selectedFiles.length} file(s) to Box!`;
      
      // Reload file list
      this.loadUploadedFiles();
      
      // Clear selections
      setTimeout(() => {
        this.selectedFiles = [];
        this.fileUploadProgress.clear();
        this.uploadProgress = 0;
      }, 2000);
      
      return;
    }

    const file = this.selectedFiles[index];
    this.currentUploadingFiles = [file.name];
    
    // Create FormData for single file
    const formData = new FormData();
    formData.append('files', file);
    formData.append('accessToken', this.accessToken);

    console.log(`📤 Uploading file ${index + 1}/${this.selectedFiles.length}: ${file.name}`);

    // Upload with progress tracking
    this.http.post<any>('/api/box/upload/files', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          // Update progress for this specific file
          const fileProgress = Math.round(100 * event.loaded / event.total);
          this.fileUploadProgress.set(file.name, fileProgress);
          
          // Calculate overall progress
          const totalFiles = this.selectedFiles.length;
          const completedFiles = index;
          const currentFileWeight = fileProgress / 100;
          this.uploadProgress = Math.round(((completedFiles + currentFileWeight) / totalFiles) * 100);
          
          console.log(`${file.name}: ${fileProgress}% | Overall: ${this.uploadProgress}%`);
        } else if (event.type === HttpEventType.Response) {
          // This file upload complete
          this.fileUploadProgress.set(file.name, 100);
          console.log(`✅ File ${index + 1}/${this.selectedFiles.length} uploaded: ${file.name}`);
          
          // Upload next file
          this.uploadFilesSequentially(index + 1);
        }
      },
      error: async (error) => {
        console.error(`❌ Failed to upload ${file.name}:`, error);
        
        // Mark this file as failed
        this.fileUploadProgress.set(file.name, 0);
        
        // If 401, try to refresh token and retry this file
        if (error.status === 401) {
          console.log('Token expired, attempting refresh...');
          const refreshed = await this.refreshAccessToken();
          
          if (refreshed) {
            console.log('Token refreshed, retrying current file...');
            // Retry current file
            this.uploadFilesSequentially(index);
            return;
          } else {
            this.isUploading = false;
            this.uploadProgress = 0;
            this.currentUploadingFiles = [];
            this.uploadErrorMessage = 'Token expired. Please logout and login again.';
            setTimeout(() => {
              this.logout();
            }, 3000);
            return;
          }
        }
        
        // For other errors, continue with next file
        console.warn(`⚠️ Skipping ${file.name}, continuing with next file...`);
        
        // Upload next file
        this.uploadFilesSequentially(index + 1);
      }
    });
  }

  testToken(): void {
    if (!this.accessToken) {
      this.uploadErrorMessage = 'No access token available';
      return;
    }

    this.isUploading = true;
    this.uploadErrorMessage = null;

    this.http.post('/api/box/upload/test-token', { accessToken: this.accessToken }).subscribe({
      next: (response: any) => {
        this.isUploading = false;
        console.log('Token test result:', response);
        
        if (response.tokenTest?.valid) {
          this.successMessage = `✅ Token is valid! User: ${response.tokenTest.user.name}`;
        } else {
          this.uploadErrorMessage = `❌ Token invalid: ${response.tokenTest?.error?.message || 'Unknown error'}`;
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadErrorMessage = `Token test failed: ${error.error?.message || error.message}`;
        console.error('Token test error:', error);
      }
    });
  }

  checkFolder(): void {
    if (!this.accessToken) {
      this.uploadErrorMessage = 'No access token available';
      return;
    }

    this.isUploading = true;
    this.uploadErrorMessage = null;

    this.http.post('/api/box/upload/folder-info', { accessToken: this.accessToken }).subscribe({
      next: (response: any) => {
        this.isUploading = false;
        console.log('Folder check result:', response);
        
        if (response.folder) {
          this.successMessage = `✅ Folder accessible! Name: ${response.folder.name}, ID: ${response.folder.id}`;
        } else {
          this.uploadErrorMessage = '❌ Folder not accessible';
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadErrorMessage = `Folder check failed: ${error.error?.message || error.message}`;
        console.error('Folder check error:', error);
      }
    });
  }

  async manualRefreshToken(): Promise<void> {
    if (!this.refreshToken) {
      this.uploadErrorMessage = 'No refresh token available';
      return;
    }

    this.isUploading = true;
    this.uploadErrorMessage = null;
    this.successMessage = null;

    const refreshed = await this.refreshAccessToken();
    this.isUploading = false;

    if (refreshed) {
      this.successMessage = '✅ Token refreshed successfully! You can now try uploading again.';
    } else {
      this.uploadErrorMessage = '❌ Failed to refresh token. Please logout and login again.';
    }
  }

  loadUploadedFiles(): void {
    if (!this.accessToken) {
      return;
    }

    this.isLoadingFiles = true;

    this.http.post('/api/box/upload/list-files', { accessToken: this.accessToken }).subscribe({
      next: (response: any) => {
        this.isLoadingFiles = false;
        this.uploadedFiles = response.files || [];
        console.log('Loaded files:', this.uploadedFiles);
        
        // Debug version numbers
        this.uploadedFiles.forEach(file => {
          console.log(`File: ${file.name}`, {
            sequence_id: file.sequence_id,
            etag: file.etag,
            file_version: file.file_version,
            calculated_version: this.getVersionNumber(file)
          });
        });
      },
      error: (error) => {
        this.isLoadingFiles = false;
        console.error('Failed to load files:', error);
      }
    });
  }
}
