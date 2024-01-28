export interface DevicesDbModel {
    deviceId: string
    title: string
    issuedAt: number // new Date() or token.issuedAt
    expiresAt: number //
    userId: string
    ip: string
}