const { data } = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controller/data.js");

exports.createData = (req, res, next) => {
  // #swagger.tags = ['Data']
  // #swagger.summary = 'Create Data'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  const nama_rute = req.body.nama_rute;
  const tanggal_pengiriman = req.body.tanggal_pengiriman;
  const total_berat_paket = req.body.total_berat_paket;
  const tujuan = req.body.tujuan;
  const total_paket = req.body.total_paket;

  const dataValue = {
    nama_rute,
    tanggal_pengiriman,
    total_berat_paket,
    tujuan,
    total_paket,
  };
  data
    .build(dataValue)
    .save()
    .then((createdDataResult) => {
      res.status(201).json({
        success: {
          messages: "Data Berhasil Ditambahkan",
        },
        data: {
          id: createdDataResult.id,
          nama_rute: createdDataResult.nama_rute,
          tanggal_pengiriman: createdDataResult.tanggal_pengiriman,
          total_berat_paket: createdDataResult.total_berat_paket,
          tujuan: createdDataResult.tujuan,
          total_paket: createdDataResult.total_paket,
        },
      });
    })
    .catch((error) => {
      logger.error(`error: ${error}`);
      res.status(500).json({
        error: {
          messages: "Gagal Menambahkan data",
        },
      });
    });
};

exports.updateData = async (req, res, next) => {
  // #swagger.tags = ['Data']
  // #swagger.summary = 'Update Data'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  const {
    id,
    nama_rute,
    tanggal_pengiriman,
    total_berat_paket,
    tujuan,
    total_paket,
  } = req.body;

  try {
    const findData = await data.findByPk(req.params.id);

    if (!findData) {
      return res.status(404).json({
        error: {
          messages: "Data tidak ditemukan",
        },
      });
    }

    findData.id = id;
    findData.nama_rute = nama_rute;
    findData.tanggal_pengiriman = tanggal_pengiriman;
    findData.total_berat_paket = total_berat_paket;
    findData.tujuan = tujuan;
    findData.total_paket = total_paket;

    await findData.save();

    logger.debug("Updated Data");

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

exports.getData = (req, res, next) => {
  // #swagger.tags = ['Data']
  // #swagger.summary = 'Get all Data'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  data
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
  // #swagger.tags = ['Data']
  // #swagger.summary = 'Get Data by ID  [admin]'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  data
    .findByPk(req.params.id)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: { messages: "Data tidak ditemukan" } });
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

exports.deleteData = (req, res, next) => {
  // #swagger.tags = ['Data']
  // #swagger.summary = 'Delete Data by ID'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  let id = req.params.id;
  data
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
          messages: "Gagal menghapus data",
        },
      });
    });
};
