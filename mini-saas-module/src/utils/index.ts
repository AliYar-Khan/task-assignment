export const generateUniqueId = (): string => {
    return 'id-' + Math.random().toString(36).substr(2, 9);
};

export const logError = (error: Error): void => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${error.message}`);
};