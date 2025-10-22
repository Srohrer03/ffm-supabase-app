import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OIDCStrategy } from 'passport-azure-ad';

@Injectable()
export class AzureAdStrategy extends PassportStrategy(OIDCStrategy, 'azure-ad') {
  constructor() {
    super({
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid_configuration`,
      clientID: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      responseType: 'code',
      responseMode: 'form_post',
      redirectUrl: process.env.AZURE_REDIRECT_URI,
      allowHttpForRedirectUrl: process.env.NODE_ENV === 'development',
      validateIssuer: false,
      passReqToCallback: false,
      scope: ['profile', 'email', 'openid'],
    });
  }

  async validate(profile: any): Promise<any> {
    return {
      oid: profile.oid,
      displayName: profile.displayName,
      name: profile.name,
      email: profile._json.email || profile._json.preferred_username,
      upn: profile._json.upn,
    };
  }
}