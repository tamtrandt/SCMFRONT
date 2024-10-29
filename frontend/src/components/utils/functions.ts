/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadFile } from "antd";


/// Format Hash
export const formatTransactionHash = (hash: string) => {
    if (!hash) return ''; // Kiểm tra nếu hash không tồn tại
    const start = hash.slice(0, 5); // Lấy 5 ký tự đầu
    const end = hash.slice(-5); // Lấy 5 ký tự cuối
    return `${start}...${end}`; // Kết hợp và thêm "..."
};

/// Files Handle
export const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const validateFileUpload = (
    newFileList: UploadFile[],
    existingFileList: UploadFile[],
    maxFiles: number,
    notification: any
): UploadFile[] | null => {
    if (newFileList.length > maxFiles) {
        notification.error({
            message: 'Error',
            description: `You can only upload up to ${maxFiles} files.`,
        });
        return null;
    }

    const totalSize = newFileList.reduce((total, file) => total + (file.size || 0), 0);
    if (totalSize > MAX_SIZE_BYTES) {
        notification.error({
            message: 'Error',
            description: `Total file size must be less than ${MAX_SIZE_BYTES / (1024 * 1024)} MB.`,
        });
        return null;
    }

    return newFileList.slice(0, maxFiles - existingFileList.length);
};

