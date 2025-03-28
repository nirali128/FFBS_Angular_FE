import { DropdownOption } from '../interfaces/dropdown.options';
import { Day } from '../interfaces/field';
import { User } from '../interfaces/user';

export function base64ToFile(base64: string, fileName: string, fileType?: string): Promise<File> {
    return new Promise((resolve, reject) => {
      try {
        // Extract MIME type from base64
        const matches = base64.match(/^data:(.+);base64,/);
        const extractedFileType = matches ? matches[1] : fileType || 'application/octet-stream';
  
        // Decode base64 to binary data
        const byteCharacters = atob(base64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: extractedFileType });
  
        resolve(new File([blob], fileName, { type: extractedFileType }));
      } catch (error) {
        reject(new Error('Failed to convert base64 to file'));
      }
    });
  }
  
  export function convertDocumentsToFiles(
    documents: { fileName: string; fileType?: string; document?: string; description?: string }[]
  ): Promise<File[]> {
    const filePromises = documents
      .filter((doc) => doc.document)
      .map((doc) => base64ToFile(doc.document!, doc.fileName, doc.fileType));
    return Promise.all(filePromises);
  }
  

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve(''); // Handle error case
  });
}

export function convertFilesToDocuments(files: File[]): Promise<
  {
    fileName: string;
    fileType?: string;
    document?: string;
    description?: string;
  }[]
> {
  return Promise.all(
    files.map(async (file) => ({
      fileName: file.name,
      fileType: file.type,
      document: await fileToBase64(file),
      description: file.name,
    }))
  );
}

export function mapDayToDropdown(day: Day[]): DropdownOption[] {
  return day.map((res) => ({
    value: res.guid,
    label: res.description,
  }));
}

export function mapUserToDropdown(day: User[]): DropdownOption[] {
  return day.filter(x => x.isActive).map((res) => ({
    value: res.userId,
    label: res.firstName + res.lastName,
  }));
}
