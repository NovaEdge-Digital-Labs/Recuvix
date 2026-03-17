import { promises as dns } from 'dns';

export async function verifyDomainDns(domain: string, verificationToken: string): Promise<boolean> {
    try {
        const records = await dns.resolveTxt(`_recuvix-verify.${domain}`);
        const flatRecords = records.flat();
        return flatRecords.includes(verificationToken);
    } catch (error) {
        console.error(`DNS verification failed for ${domain}:`, error);
        return false;
    }
}
