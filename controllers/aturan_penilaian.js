const { aturan_penilaian } = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controller/aturan_penilaian.js");

exports.createAturanPenilaian = (req, res, next) => {
  // #swagger.tags = ['Aturan Penilaian']
  // #swagger.summary = 'Create Aturan Penilaian'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  const keterangan = req.body.keterangan;
  const nilai = req.body.nilai;
  const descnilai = req.body.descnilai;

  const dataaturan_penilaian = {
    keterangan,
    nilai,
    descnilai,
  };
  aturan_penilaian
    .build(dataaturan_penilaian)
    .save()
    .then((createdAturanPenilaian) => {
      res.status(201).json({
        success: {
          messages: "Data Aturan Penilaian Berhasil Ditambahkan",
        },
        data: {
          id: createdAturanPenilaian.id,
          keterangan: createdAturanPenilaian.keterangan,
          nilai: createdAturanPenilaian.nilai,
          descnilai: createdAturanPenilaian.descnilai,
        },
      });
    })
    .catch((error) => {
      logger.error(`error: ${error}`);
      res.status(500).json({
        error: {
          messages: "Gagal Menambahkan Aturan Penilaian",
        },
      });
    });
};

exports.updateAturanPenilaian = async (req, res, next) => {
  // #swagger.tags = ['Aturan Penilaian']
  // #swagger.summary = 'Update Aturan Penilaian'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  const { keterangan, nilai, descnilai } = req.body;

  try {
    const AturanPenilaian = await aturan_penilaian.findByPk(req.params.id);

    if (!AturanPenilaian) {
      return res.status(404).json({
        error: {
          messages: "Data tidak ditemukan",
        },
      });
    }

    AturanPenilaian.keterangan = keterangan;
    AturanPenilaian.nilai = nilai;
    AturanPenilaian.descnilai = descnilai;

    await AturanPenilaian.save();

    logger.debug("Updated AturanPenilaian");

    res.status(200).json({
      success: {
        messages: "Data berhasil di ubah",
      },
    });
  } catch (error) {
    logger.error(`error: ${error}`);

    res.status(500).json({
      error: {
        messages: "Terjadi Kesalahan",
      },
    });
  }
};

exports.getAturanPenilaian = (req, res, next) => {
  // #swagger.tags = ['Aturan Penilaian']
  // #swagger.summary = 'Get all Aturan Penilaian'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  aturan_penilaian
    .findAll({
      limit: 1000,
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      logger.error(`error: ${error}`);
      res.status(500).json({
        error: {
          messages: "Gagal mengambil data",
        },
      });
    });
};

exports.getById = (req, res, next) => {
  // #swagger.tags = ['Aturan Penilaian']
  // #swagger.summary = 'Get Aturan Penilaian by ID  [admin]'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  aturan_penilaian
    .findByPk(req.params.id)
    .then((aturan_penilaian) => {
      if (aturan_penilaian) {
        res.status(200).json(aturan_penilaian);
      } else {
        res
          .status(404)
          .json({ error: { messages: "Aturan penilaian tidak ditemukan" } });
      }
    })
    .catch((error) => {
      logger.error(`error: ${error}`);
      res.status(500).json({
        error: {
          messages: "Gagal mengambil data",
        },
      });
    });
};

exports.deleteAturanPenilaian = (req, res, next) => {
  // #swagger.tags = ['Aturan Penilaian']
  // #swagger.summary = 'Delete Aturan Penilaian by ID'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  let id = req.params.id;
  aturan_penilaian
    .destroy({ where: { id } })
    .then((result) => {
      logger.debug(result);
      if (result > 0) {
        res.status(200).json({ success: { messages: "Berhasil di hapus" } });
      } else {
        res.status(500).json({
          error: {
            messages: "Terjadi Kesalahan",
          },
        });
      }
    })
    .catch((error) => {
      logger.error(`error: ${error}`);
      res.status(500).json({
        error: {
          messages: "Gagal menghapus Aturan Penilaian",
        },
      });
    });
};
