export interface EmailConfirmationModel {
    userEmail: string
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export interface EmailResending {
    email: string
}