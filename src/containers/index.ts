import coderIDE from './coder';

export const startContainers = (name: String) => ({
    coder: coderIDE(name)
});
