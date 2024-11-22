import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseService {
  constructor() {
    const { private_key } = JSON.parse(process.env.PRIVATEKEY || "");
    const serviceAccount: any = {
      type: process.env.TYPE || "",
      project_id: process.env.PROJECTID || "",
      private_key_id: process.env.PRIVATEKEYID || "",
      private_key: private_key.replace(/\\n/g, "\n"),
      client_email: process.env.CLIENTEMAIL || "",
      client_id: process.env.CLIENTID || "",
      auth_uri: process.env.AUTHURI || "",
      token_uri: process.env.TOKENURI || "",
      auth_provider_x509_cert_url: process.env.AUTHPROVIDERX509CERTURL || "",
      client_x509_cert_url: process.env.CLIENTX509CERTURL || "",
      universe_domain: process.env.UNIVERSEDOMAIN || "",
    };

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.BUCKETNAME,
      });
    }
  }

  private get bucket() {
    return admin.storage().bucket();
  }

  public async uploadImage(file: any, folder: string = "images-blog") {
    try {
      const fileName = `${folder}/${Date.now()}_${file.originalname}`;
      const fileUpload = this.bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      await fileUpload.makePublic();

      return {
        url: `https://storage.googleapis.com/${this.bucket.name}/${fileName}`,
        fileName,
      };
    } catch (error) {
      throw new InternalServerErrorException("Failed to upload image");
    }
  }

  async deleteImage(fileName: string) {
    try {
      await this.bucket.file(fileName).delete();
      return { message: "File deleted successfully" };
    } catch (error) {
      throw new InternalServerErrorException("Failed to delete image");
    }
  }
}
