import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { env } from './env';

export function generateAgoraToken(
  channelName: string,
  uid: string,
  role: 'publisher' | 'subscriber' = 'publisher'
): { token: string; expiresIn: number } {
  const appId = env.AGORA_APP_ID;
  const appCertificate = env.AGORA_APP_CERTIFICATE;
  
  if (!appId || !appCertificate) {
    throw new Error('Agora credentials not configured');
  }

  // Token expires in 24 hours
  const expirationTimeInSeconds = 86400;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Convert uid to number (Agora uses numeric UIDs)
  const numericUid = parseInt(uid.replace(/[^0-9]/g, '').slice(0, 10)) || 0;

  const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    numericUid,
    agoraRole,
    privilegeExpiredTs
  );

  return {
    token,
    expiresIn: expirationTimeInSeconds,
  };
}

export function generateAgoraTokenWithAccount(
  channelName: string,
  account: string,
  role: 'publisher' | 'subscriber' = 'publisher'
): { token: string; expiresIn: number } {
  const appId = env.AGORA_APP_ID;
  const appCertificate = env.AGORA_APP_CERTIFICATE;
  
  if (!appId || !appCertificate) {
    throw new Error('Agora credentials not configured');
  }

  const expirationTimeInSeconds = 86400;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const token = RtcTokenBuilder.buildTokenWithAccount(
    appId,
    appCertificate,
    channelName,
    account,
    agoraRole,
    privilegeExpiredTs
  );

  return {
    token,
    expiresIn: expirationTimeInSeconds,
  };
}
