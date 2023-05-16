const {
  data,
  bobot_kriteria,
  kriteria_penilaian,
  aturan_penilaian,
  jenis_kendaraan,
  perhitungan,
} = require("../models");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controller/perhitungan.js");
const { Op } = require("sequelize");

function hitungSkor(nilai, bobotKriteria) {
  let skor = 0;
  for (let i = 0; i < bobotKriteria.length; i++) {
    const bk = bobotKriteria[i];
    if (bk.isMinMax) {
      if (nilai >= bk.min_nilai && nilai <= bk.max_nilai) {
        skor = bk.bobotkriteria;
        break;
      }
      // tambahan logika jika nilai lebih besar dari max_nilai
      else if (nilai > bk.max_nilai) {
        skor = bk.bobotkriteria;
      }
    } else {
      if (nilai === bk.nilai) {
        skor = bk.bobotkriteria;
        break;
      }
    }
  }
  return skor;
}

function tentukanKeterangan(nilai, aturan) {
  if (aturan.descnilai === ">=") {
    return nilai >= aturan.nilai ? aturan.keterangan : null;
  } else if (aturan.descnilai === ">") {
    return nilai > aturan.nilai ? aturan.keterangan : null;
  } else if (aturan.descnilai === "<=") {
    return nilai <= aturan.nilai ? aturan.keterangan : null;
  } else if (aturan.descnilai === "<") {
    return nilai < aturan.nilai ? aturan.keterangan : null;
  } else if (aturan.descnilai === "==") {
    return nilai == aturan.nilai ? aturan.keterangan : null;
  } else if (aturan.descnilai === "!=") {
    return nilai != aturan.nilai ? aturan.keterangan : null;
  } else {
    return "Terjadi kesalahan dalam menentukan keterangan";
  }
}

exports.Hitung = async (req, res, next) => {
  // #swagger.tags = ['Perhitungan']
  // #swagger.summary = 'Create Perhitungan format date for tanggal_pengiriman YYYY-MM-DD'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  try {
    const { tanggal_pengiriman } = req.body;
    // Ambil data dari tabel data
    const findData = await data.findAll({
      where: {
        tanggal_pengiriman: {
          [Op.between]: [
            new Date(tanggal_pengiriman),
            new Date(tanggal_pengiriman + " 23:59:59"), // add end of day time
          ],
        },
      },
    });

    if (findData.length <= 0) {
      return res.status(404).json({
        error: {
          messages: "Data tidak ditemukan",
        },
      });
    }

    const bobotKriteria = await bobot_kriteria.findAll({
      include: {
        model: kriteria_penilaian,
        attributes: ["kode_kriteria", "nama_kriteria"],
        as: "kriteria_penilaian",
      },
    });
    let result = [];
    let matrix = [];
    for (let i = 0; i < findData.length; i++) {
      let alternatif = {
        tanggal_pengiriman: findData[i].tanggal_pengiriman,
        nama_rute: findData[i].nama_rute,
        total_berat_paket: findData[i].total_berat_paket,
        tujuan: findData[i].tujuan,
        total_paket: findData[i].total_paket,
      };
      let c1Nilai = findData[i].total_berat_paket;
      let c2Nilai = findData[i].tujuan;
      let c3Nilai = findData[i].total_paket;

      let c1Bobot = bobotKriteria.filter(
        (bk) => bk.kriteria_penilaian?.kode_kriteria === "C1"
      );
      let c2Bobot = bobotKriteria.filter(
        (bk) => bk.kriteria_penilaian?.kode_kriteria === "C2"
      );
      let c3Bobot = bobotKriteria.filter(
        (bk) => bk.kriteria_penilaian?.kode_kriteria === "C3"
      );

      let c1Skor = hitungSkor(c1Nilai, c1Bobot);
      let c2Skor = hitungSkor(c2Nilai, c2Bobot);
      let c3Skor = hitungSkor(c3Nilai, c3Bobot);

      alternatif.C1 = c1Skor;
      alternatif.C2 = c2Skor;
      alternatif.C3 = c3Skor;

      result.push(alternatif);
      // Ubah kedalam bentuk matriks

      // Membuat array untuk setiap kriteria (C1, C2, C3)
      let c1 = [];
      let c2 = [];
      let c3 = [];

      result.forEach(function (rute) {
        c1.push(rute.C1);
        c2.push(rute.C2);
        c3.push(rute.C3);
      });

      // Membuat matriks dari array kriteria
      matrix = [c1, c2, c3];
    }

    let sumPow = 0;
    let arrNormal = [];

    for (let i = 0; i < matrix.length; i++) {
      sumPow = 0;
      for (let j = 0; j < matrix[i].length; j++) {
        sumPow += Math.pow(matrix[i][j], 2);
      }
      let normal = Math.sqrt(sumPow);
      let arrTemp = [];
      for (let k = 0; k < matrix[i].length; k++) {
        arrTemp.push(matrix[i][k] / normal);
      }
      arrNormal.push(arrTemp);
    }

    const findKriteriaPenilaian = await kriteria_penilaian.findAll();

    const bobot = findKriteriaPenilaian.map((k) => k.bobot);
    const matriks_keputusan = arrNormal.map((arr, i) =>
      arr.map((d) => d * bobot[i])
    );

    const maximum = matriks_keputusan[0].map((value, index) => {
      return value + matriks_keputusan[1][index];
    });

    const minimum = matriks_keputusan[2];

    const yi = matriks_keputusan[0].map((value, index) => {
      return maximum[index] - minimum[index];
    });

    const jsonData = [];

    for (let i = 0; i < result.length; i++) {
      const row = {
        nama_rute: result[i].nama_rute,
        tanggal_pengiriman: result[i].tanggal_pengiriman,
        total_berat_paket: result[i].total_berat_paket,
        total_paket: result[i].total_paket,
        tujuan: result[i].tujuan,
        maximum: maximum[i].toFixed(3),
        minimum: minimum[i].toFixed(3),
        yi: yi[i].toFixed(3),
      };
      jsonData.push(row);
    }

    //Menentukan penilaian
    const aturanPenilaian = await aturan_penilaian.findAll();

    const hasilPenilaian = jsonData.map((item) => {
      let keterangan = null;
      aturanPenilaian.forEach((aturan) => {
        if (!keterangan) {
          keterangan = tentukanKeterangan(item.yi, aturan);
        }
      });
      return {
        nama_rute: item.nama_rute,
        tanggal_pengiriman: item.tanggal_pengiriman,
        yi: item.yi,
        total_berat_paket: item.total_berat_paket,
        total_paket: item.total_paket,
        tujuan: item.tujuan,
        keterangan: keterangan,
      };
    });

    // Ambil data jenis kendaraan dari tabel
    const FindjenisKendaraan = await jenis_kendaraan.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    // Looping untuk menentukan jenis kendaraan pada setiap data
    for (let i = 0; i < hasilPenilaian.length; i++) {
      const total_berat_paket = hasilPenilaian[i].total_berat_paket;

      // Cari jenis kendaraan yang kapasitas muatannya sesuai dengan total berat paket
      // let jenis_kendaraan = "";
      let jenisKendaraanId = "";
      for (let j = 0; j < FindjenisKendaraan.length; j++) {
        if (total_berat_paket <= FindjenisKendaraan[j].kapasitas_muatan) {
          jenisKendaraanId = FindjenisKendaraan[j];
          // jenis_kendaraan = FindjenisKendaraan[j].jenis_kendaraan;
          break;
        } else {
          jenisKendaraanId = "Berat paket melebihi kapasitas muatan";
        }
      }

      // Tambahkan jenis kendaraan pada data
      // hasilPenilaian[i].jenis_kendaraan = jenis_kendaraan;
      hasilPenilaian[i].jenisKendaraanId = jenisKendaraanId;
    }

    res.status(200).json({
      perhitungan_alternatif: result,
      matrix: matrix,
      matriks_keputusan: matriks_keputusan,
      nilai_yi: jsonData,
      hasil_penilaian: hasilPenilaian,
    });
  } catch (error) {
    logger.log(error);
    next(error);
  }
};

exports.Simpan = async (req, res, next) => {
  // #swagger.tags = ['Perhitungan']
  // #swagger.summary = 'Simpan Perhitungan'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */

  // Validate the input
  // Validate the input
  const { body } = req;
  const errors = [];

  if (!Array.isArray(body)) {
    return res.status(400).json({
      error: {
        messages: "Input must be an array",
      },
    });
  }

  for (const item of body) {
    const requiredFields = [
      "nama_rute",
      "tanggal_pengiriman",
      "yi",
      "total_berat_paket",
      "total_paket",
      "tujuan",
      "keterangan",
      "jenisKendaraanId",
    ];

    for (const field of requiredFields) {
      if (!item[field]) {
        errors.push(`${field} is required`);
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        messages: errors,
      },
    });
  }

  // Create an array of objects from the request body
  const dataValues = body.map((item) => ({
    nama_rute: item.nama_rute,
    tanggal_pengiriman: item.tanggal_pengiriman,
    yi: parseFloat(item.yi),
    total_berat_paket: item.total_berat_paket,
    total_paket: item.total_paket,
    tujuan: item.tujuan,
    keterangan: item.keterangan,
    jenisKendaraanId: item.jenisKendaraanId.id,
  }));

  // Save all objects in a single transaction
  try {
    await perhitungan.bulkCreate(dataValues, { returning: true });

    res.status(201).json({
      success: {
        messages: "Data Perhitungan Berhasil Disimpan",
      },
      data: dataValues,
    });
  } catch (error) {
    logger.error(`error: ${error}`);
    res.status(500).json({
      error: {
        messages: "Gagal menyimpan data",
      },
    });
  }
};

exports.getData = (req, res, next) => {
  // #swagger.tags = ['Perhitungan']
  // #swagger.summary = 'Get all Perhitungan'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  perhitungan
    .findAll({
      include: {
        model: jenis_kendaraan,
        attributes: ["jenis_kendaraan"],
        as: "jenis_kendaraan",
      },
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      logger.error(`error: ${error}`);
      res.status(500).json({
        error: {
          messages: "Gagal mengambil data perhitungan",
        },
      });
    });
};

exports.getById = (req, res, next) => {
  // #swagger.tags = ['Perhitungan']
  // #swagger.summary = 'Get Perhitungan by ID  [admin]'
  /* #swagger.security = [{
        "bearerAuth": []
      }] 
  */
  perhitungan
    .findByPk(req.params.id)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res
          .status(404)
          .json({ error: { messages: "Perhitungan tidak ditemukan" } });
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
