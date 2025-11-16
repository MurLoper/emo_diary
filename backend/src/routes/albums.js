const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const { auth } = require('../middlewares/auth');

/**
 * @route   POST /api/albums
 * @desc    创建图文集
 * @access  Private
 */
router.post('/', auth, albumController.createAlbum);

/**
 * @route   GET /api/albums
 * @desc    获取图文集列表
 * @access  Private
 */
router.get('/', auth, albumController.getAlbums);

/**
 * @route   GET /api/albums/:id
 * @desc    获取图文集详情
 * @access  Private
 */
router.get('/:id', auth, albumController.getAlbumById);

/**
 * @route   PUT /api/albums/:id
 * @desc    更新图文集
 * @access  Private
 */
router.put('/:id', auth, albumController.updateAlbum);

/**
 * @route   DELETE /api/albums/:id
 * @desc    删除图文集
 * @access  Private
 */
router.delete('/:id', auth, albumController.deleteAlbum);

module.exports = router;
