const User = require('../models/user.model');
const ProfileService = require('./profile.service');
const { hashPassword } = require('../utils/crypto');

class UserService {
  constructor() {
    this.profileService = new ProfileService();
  }

  async createUser(userData) {
    const hashedPassword = await hashPassword(userData.password);
    
    const user = new User({
      ...userData,
      password: hashedPassword,
      status: 'active'
    });

    await user.save();
    
    // 创建用户画像
    await this.profileService.createProfile(user._id);
    
    return user;
  }

  async findByEmailOrPhone(email, phone) {
    return User.findOne({
      $or: [{ email }, { phone }]
    });
  }

  async updateUserProfile(userId, profileData) {
    return this.profileService.updateProfile(userId, profileData);
  }

  async getUserAnalytics(userId) {
    const profile = await this.profileService.getProfile(userId);
    return {
      healthScore: profile.healthScore,
      activityLevel: profile.activityLevel,
      preferences: profile.preferences,
      riskFactors: profile.riskFactors
    };
  }
}

module.exports = UserService; 