import { Document, Model } from 'mongoose';

// 基础文档接口
export interface IBaseDocument extends Document {
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 用户文档接口
export interface IUser extends IBaseDocument {
  /** username 的描述 */
  username: string;
  /** email 的描述 */
  email: string;
  /** password 的描述 */
  password: string;
  /** roles 的描述 */
  roles: string[];
  /** status 的描述 */
  status: "active" | "inactive" | "locked";
  /** profile 的描述 */
  profile: {
    name?: string;
    avatar?: string;
    phone?: string;
  };
}

// 健康数据文档接口
export interface IHealthData extends IBaseDocument {
  /** userId 的描述 */
  userId: string;
  /** type 的描述 */
  type: "vital_signs" | "exercise" | "diet" | "sleep";
  /** metrics 的描述 */
  metrics: {
    [key: string]: number | string | object;
  };
  /** source 的描述 */
  source: string;
  /** deviceInfo 的描述 */
  deviceInfo?: undefined | { deviceId: string; deviceType: string; };
}
