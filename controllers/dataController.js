const connection = require('../dbConnect');

const db = {
  getCounts: (cb) => {
    connection.query('SELECT counts FROM mydb.visitor;', (err, data) => {
      if (err) throw err;
      cb(data);
    });
  },
  incCounts: (cb) => {
    connection.query(
      'UPDATE mydb.visitor SET counts = counts + 1 WHERE id = 1;',
      (err) => {
        if (err) throw err;
        cb(JSON.stringify('업데이트 성공'));
      }
    );
  },
  getSurvey: (cb) => {
    connection.query(
      'SELECT * FROM mydb.question q LEFT JOIN mydb.answer a ON q.ID_PK=a.QUESTION_ID_FK',
      (err, data) => {
        if (err) throw err;
        cb(data);
      }
    );
  },
  getExplanation: (cb) => {
    connection.query('SELECT * FROM mydb.explanation', (err, data) => {
      if (err) throw err;
      cb(data);
    });
  },
};

module.exports = db;
