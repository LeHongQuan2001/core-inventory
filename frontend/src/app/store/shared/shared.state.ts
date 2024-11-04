export interface SharedState {
    showLoading: boolean;
    errorMessage: string;
    successMessage: string;
}

export const initialState: SharedState = {
    showLoading: false,
    errorMessage: '',
    successMessage: '',
};
