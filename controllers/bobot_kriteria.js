const { bobot_kriteria, kriteria_penilaian } = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controller/kriteria_penilaian.js");

exports.createBobotKriteria = (req, res, next) => {
  // #swagger.tags = ['Bobot Kriteria']
  // #swagger.summary = 'Create Bobot Kriteria'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  const kriteriaPenilaianId = req.body.kriteriaPenilaianId;
  const nilai = req.body.nilai;
  const isMinMax = req.body.isMinMax;
  const min_nilai = req.body.min_nilai;
  const max_nilai = req.body.max_nilai;
  const bobotkriteria = req.body.bobotkriteria;

  const databobot_kriteria = {
    kriteriaPenilaianId,
    nilai,
    isMinMax,
    min_nilai,
    max_nilai,
    bobotkriteria,
  };
  bobot_kriteria
    .build(databobot_kriteria)
    .save()
    .then((createdBobotKriteria) => {
      res.status(201).json({
        success: {
          messages: "Data Bobot Kriteria Berhasil Ditambahkan",
        },
        data: {
          id: createdBobotKriteria.id,
          kriteriaPenilaianId: createdBobotKriteria.kriteriaPenilaianId,
          nilai: createdBobotKriteria.nilai,
          isMinMax: createdBobotKriteria.isMinMax,
          min_nilai: createdBobotKriteria.min_nilai,
          max_nilai: createdBobotKriteria.max_nilai,
          bobotkriteria: createdBobotKriteria.bobotkriteria,
        },
      });
    })
    .catch((error) => {
      logger.error(`error: ${error}`);
      res.status(500).json({
        error: {
          messages: "Gagal Menambahkan Bobot Kriteria",
        },
      });
    });
};

exports.updateBobotKriteria = async (req, res, next) => {
  // #swagger.tags = ['Bobot Kriteria']
  // #swagger.summary = 'Update Bobot Kriteria'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  const {
    id,
    kriteriaPenilaianId,
    nilai,
    isMinMax,
    min_nilai,
    max_nilai,
    bobotkriteria,
  } = req.body;

  try {
    const BobotKriteria = await bobot_kriteria.findByPk(req.params.id);

    if (!BobotKriteria) {
      return res.status(404).json({
        error: {
          messages: "Data tidak ditemukan",
        },
      });
    }

    BobotKriteria.kriteriaPenilaianId = kriteriaPenilaianId;
    BobotKriteria.nilai = nilai;
    BobotKriteria.isMinMax = isMinMax;
    BobotKriteria.min_nilai = min_nilai;
    BobotKriteria.max_nilai = max_nilai;
    BobotKriteria.bobotkriteria = bobotkriteria;

    await BobotKriteria.save();

    logger.debug("Updated BobotKriteria");

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

exports.getBobotKriteria = (req, res, next) => {
  // #swagger.tags = ['Bobot Kriteria']
  // #swagger.summary = 'Get all Bobot Kriteria'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  bobot_kriteria
    .findAll({
      include: {
        model: kriteria_penilaian,
        attributes: ["kode_kriteria", "nama_kriteria"],
        as: "kriteria_penilaian",
      },
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
  // #swagger.tags = ['Bobot Kriteria']
  // #swagger.summary = 'Get Bobot Kriteria by id'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  bobot_kriteria
    .findByPk(req.params.id, {
      include: {
        model: kriteria_penilaian,
        attributes: ["kode_kriteria", "nama_kriteria"],
        as: "kriteria_penilaian",
      },
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

exports.deleteBobotKriteria = (req, res, next) => {
  // #swagger.tags = ['Bobot Kriteria']
  // #swagger.summary = 'Delete Bobot Kriteria by ID'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  let id = req.params.id;
  bobot_kriteria
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
          messages: "Gagal menghapus Bobot Kriteria",
        },
      });
    });
};
