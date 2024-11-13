import { GoogleCredentialResponse } from "@react-oauth/google";

export type GoogleUsers = GoogleCredentialResponse & {
    email: string;
}