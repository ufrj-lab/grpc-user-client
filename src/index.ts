import { credentials, loadObject } from 'grpc'

import { StructDecode } from '@ufrj/grpc-utils'

import pb from '@ufrj/proto-user'

const { User } = loadObject(pb).user as any

interface ISslConfigs {
    rootCerts: Buffer
    privateKey: Buffer
    certChain: Buffer
}



export class UserClient {
    private client: any

    constructor(url: string, sslConfigs: ISslConfigs | undefined) {
        this.client = new User(
            url,
            sslConfigs !== undefined
                ? credentials.createSsl(
                      sslConfigs.rootCerts,
                      sslConfigs.privateKey,
                      sslConfigs.certChain,
                  )
                : credentials.createInsecure(),
        )
        
    }

    public login(
        arg: pb.user.IUserLoginRequest,
    ): Promise<pb.user.IUserLoginReply> {
        return new Promise((resolve, reject) => {
            this.client.login({ ...arg }, (err: any, res: any) => {
                if (err) {
                    reject(err)
                    return 
                }

                if (res.user) {
                    res.user = StructDecode.decodeStruct(res.user)
                }

                resolve(res)
            })
        })
    }

    public signUp(
        arg: pb.user.IUserSignUpRequest,
    ): Promise<pb.user.IUserSignUpReply> {
        return new Promise((resolve, reject) => {
            this.client.signup({ ...arg }, (err: any, res: any) => {
                if (err) {
                    reject(err)
                    return
                }

                if (res.user) {
                    res.user = StructDecode.decodeStruct(res.user)
                }

                resolve(res)
            })
        })
    }
}
