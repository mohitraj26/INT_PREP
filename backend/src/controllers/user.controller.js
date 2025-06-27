import { db } from '../libs/db.js';

export const updateProfileImage = async (req, res) => {
  const { userId, imageUrl } = req.body;

  if (!userId || !imageUrl) {
    return res.status(400).json({ message: 'userId and imageUrl are required' });
  }

  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    return res.status(200).json({
      message: 'Profile image updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    return res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const updateUserName = async (req, res) => {
  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: 'userId and name are required' });
  }

  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { name },
    });

    return res.status(200).json({
      message: 'Name updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating name:', error);
    return res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const updateUserEmail = async (req, res) => {
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ message: 'userId and email are required' });
  }

  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { email },
    });

    return res.status(200).json({
      message: 'Email updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating email:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: 'Something went wrong', error });
  }
};
