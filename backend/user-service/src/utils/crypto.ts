import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Error in hashPassword:', error);
    throw error;
  }
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    return bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error in comparePassword:', error);
    throw error;
  }
}

export async function generateToken(length = 32): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, (err, buf) => {
        if (err) reject(err);
        resolve(buf.toString('hex'));
      });
    });
  } catch (error) {
    console.error('Error in generateToken:', error);
    throw error;
  }
}
