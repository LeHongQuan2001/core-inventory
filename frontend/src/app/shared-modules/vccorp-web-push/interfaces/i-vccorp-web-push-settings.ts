/**
 * Standardize an key-value objet to configure GA installation.
 */
export interface IVccorpWebPushSettings {
    /** Is mandatory to provide a tracking code folks... */
    appId: string;
    /** If Vccorp changes the uri and I die, you can survive! */
    uri?: string;
    callback: any;
    /** If true, trace VCCorp tracking errors in production mode */
    enableTracing?: boolean;
}
