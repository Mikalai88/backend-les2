export interface DevicesDbModel {
    deviceId: string
    title: string
    issuedAt: number // new Date() or token.issuedAt
    expiresAt: number // время выпуска последнего refreshToken
    userId: string
    ip: string
}