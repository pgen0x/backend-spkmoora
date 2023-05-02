const { Kriteria_Penilaians } = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controller/kriteria_penilaian.js");

exports.createKriteriaPenilaian = (req, res, next) => {
  // #swagger.tags = ['Kriteria Penilaian']
  // #swagger.summary = 'Create Kriteria Penilaian'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  const kode_kriteria = req.body.kode_kriteria;
  const nama_kriteria = req.body.nama_kriteria;
  const bobot = req.body.bobot;

  const datakriteria_penilaians = {
    kode_kriteria,
    nama_kriteria,
    bobot,
  };
  Kriteria_Penilaians.build(datakriteria_penilaians)
    .save()
    .then((createdKriteriaPenilaian) => {
      res.status(201).json({
        success: {
          messages: "Data Kriteria Penilaian Berhasil Ditambahkan",
        },
        data: {
          id: createdKriteriaPenilaian.id,
          kode_kriteria: createdKriteriaPenilaian.kode_kriteria,
          nama_kriteria: createdKriteriaPenilaian.nama_kriteria,
          bobot: createdKriteriaPenilaian.bobot,
        },
      });
    })
    .catch((error) => {
      logger.error(`error: ${error}`);
      res.status(500).json({
        error: {
          messages: "Gagal Menambahkan Kriteria Penilaian",
        },
      });
    });
};

exports.updateKriteriaPenilaian = async (req, res, next) => {
  // #swagger.tags = ['Kriteria Penilaian']
  // #swagger.summary = 'Update Kriteria Penilaian'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  const { kode_kriteria, nama_kriteria, bobot } = req.body;

  try {
    const KriteriaPenilaian = await Kriteria_Penilaians.findByPk(req.params.id);

    if (!KriteriaPenilaian) {
      return res.status(404).json({
        error: {
          messages: "Data tidak ditemukan",
        },
      });
    }

    KriteriaPenilaian.kode_kriteria = kode_kriteria;
    KriteriaPenilaian.nama_kriteria = nama_kriteria;
    KriteriaPenilaian.bobot = bobot;

    await KriteriaPenilaian.save();

    logger.debug("Updated KriteriaPenilaian");

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

exports.getKriteriaPenilaian = (req, res, next) => {
  // #swagger.tags = ['Kriteria Penilaian']
  // #swagger.summary = 'Get all Kriteria Penilaian'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  Kriteria_Penilaians.findAll({
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

exports.deleteKriteriaPenilaian = (req, res, next) => {
  // #swagger.tags = ['Kriteria Penilaian']
  // #swagger.summary = 'Delete Kriteria Penilaian by ID'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  let id = req.params.id;
  Kriteria_Penilaians.destroy({ where: { id } })
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
          messages: "Gagal menghapus Kriteria Penilaian",
        },
      });
    });
};
