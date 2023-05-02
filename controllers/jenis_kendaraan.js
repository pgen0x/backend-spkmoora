const { Jenis_Kendaraans } = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controller/jenis_kendaraan.js");

exports.createJenisKendaraan = (req, res, next) => {
  // #swagger.tags = ['JenisKendaraan']
  // #swagger.summary = 'Create Jenis Kendaraan'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  const jenis_kendaraan = req.body.jenis_kendaraan;
  const kapasitas_muatan = req.body.kapasitas_muatan;

  const datajenis_kendaraan = {
    jenis_kendaraan,
    kapasitas_muatan,
  };
  Jenis_Kendaraans.build(datajenis_kendaraan)
    .save()
    .then((createdJenisKendaraan) => {
      res.status(201).json({
        success: {
          messages: "Data Jenis Kendaraan Berhasil Ditambahkan",
        },
        data: {
          id: createdJenisKendaraan.id,
          jenis_kendaraan: createdJenisKendaraan.jenis_kendaraan,
          kapasitas_muatan: createdJenisKendaraan.kapasitas_muatan,
        },
      });
    })
    .catch((error) => {
      logger.error(`error: ${error}`);
      res.status(500).json({
        error: {
          messages: "Gagal Menambahkan Jenis Kendaraan",
        },
      });
    });
};

exports.updateJenisKendaraan = async (req, res, next) => {
  // #swagger.tags = ['JenisKendaraan']
  // #swagger.summary = 'Update Jenis Kendaraan'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  const { jenis_kendaraan, kapasitas_muatan } = req.body;

  try {
    const jenisKendaraan = await Jenis_Kendaraans.findByPk(req.params.id);

    if (!jenisKendaraan) {
      return res.status(404).json({
        error: {
          messages: "Data tidak ditemukan",
        },
      });
    }

    jenisKendaraan.jenis_kendaraan = jenis_kendaraan;
    jenisKendaraan.kapasitas_muatan = kapasitas_muatan;

    await jenisKendaraan.save();

    logger.debug("Updated JenisKendaraan");

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

exports.getJenisKendaraan = (req, res, next) => {
  // #swagger.tags = ['JenisKendaraan']
  // #swagger.summary = 'Get all Jenis Kendaraan'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  Jenis_Kendaraans.findAll({
    limit: 1000,
    order: [["jenis_kendaraan", "ASC"]],
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

exports.deleteJenisKendaraan = (req, res, next) => {
  // #swagger.tags = ['JenisKendaraan']
  // #swagger.summary = 'Delete Jenis Kendaraan by ID'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  let id = req.params.id;
  Jenis_Kendaraans.destroy({ where: { id } })
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
          messages: "Gagal menghapus jenis kendaraan",
        },
      });
    });
};
