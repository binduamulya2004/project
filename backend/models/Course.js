const { Model } = require('objection');

class Course extends Model {
  static get tableName() {
    return 'courses';
  }

  static get idColumn() {
    return 'id'; 
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'image', 'startDate', 'endDate', 'duration', 'rating', 'mentor'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        image: { type: 'string' },
        startDate: { type: 'string', format: 'date' },
        endDate: { type: 'string', format: 'date' },
        duration: { type: 'integer' },
        rating: { type: 'number' },
        mentor: { type: 'string' },
      },
    };
  }
}

module.exports = Course;
