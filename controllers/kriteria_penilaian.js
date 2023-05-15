const { kriteria_penilaian } = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controller/kriteria_penilaian.js");

exports.createKriteriaPenilaian = async (req, res, next) => {
  // #swagger.tags = ['Kriteria Penilaian']
  // #swagger.summary = 'Create Kriteria Penilaian'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  try {
    const { kode_kriteria, nama_kriteria, bobot } = req.body;

    // Check if kode kriteria is valid and not duplicated
    const validKodeKriteria = ["C1", "C2", "C3"];
    if (!validKodeKriteria.includes(kode_kriteria)) {
      return res.status(400).json({
        error: {
          messages: "Kode Kriteria harus C1, C2, or C3",
        },
      });
    }
    const isKodeKriteriaDuplicated = await kriteria_penilaian.findOne({
      where: { kode_kriteria },
    });
    if (isKodeKriteriaDuplicated) {
      return res.status(400).json({
        error: {
          messages: "Kode Kriteria sudah ada, silahkan gunakan kode yang lain",
        },
      });
    }

    // Check if number of kriteria penilaian is not more than 3
    const countKriteriaPenilaian = await kriteria_penilaian.count();
    if (countKriteriaPenilaian >= 3) {
      return res.status(400).json({
        error: {
          messages: "Kriteria dibatasi maksimal 3 kriteria",
        },
      });
    }

    const datakriteria_penilaians = {
      kode_kriteria,
      nama_kriteria,
      bobot,
    };
    const createdKriteriaPenilaian = await kriteria_penilaian.create(
      datakriteria_penilaians
    );
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
  } catch (error) {
    logger.error(`error: ${error}`);
    res.status(500).json({
      error: {
        messages: "Gagal Menambahkan Kriteria Penilaian",
      },
    });
  }
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
    const KriteriaPenilaian = await kriteria_penilaian.findByPk(req.params.id);

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
  kriteria_penilaian.findAll({
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
  // #swagger.tags = ['Kriteria Penilaian']
  // #swagger.summary = 'Get Kriteria Penilaian by ID  [admin]'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  kriteria_penilaian
    .findByPk(req.params.id)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res
          .status(404)
          .json({ error: { messages: "Kriteria Penilaian tidak ditemukan" } });
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

exports.deleteKriteriaPenilaian = (req, res, next) => {
  // #swagger.tags = ['Kriteria Penilaian']
  // #swagger.summary = 'Delete Kriteria Penilaian by ID'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  let id = req.params.id;
  kriteria_penilaian.destroy({ where: { id } })
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
