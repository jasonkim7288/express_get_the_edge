const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CrawlSchema = Schema({
  jobTitle: {
    type: Stirng,
    required: true
  },
  region: {
    type: Stirng,
    required: true
  },
  skills: [
    {
      keyword: {
        type: String,
        required: true
      }
    }
  ],
  results: [
    {
      createdAt: {
        type: Date,
        required: true,
        default: Date.now
      },
      skills: [
        {
          keyword: {
            type: String,
            required: true
          },
          count: {
            type: Number,
            required: true,
            default: 0
          }
        }
      ]
    }
  ],
  isDefault: {
    type: Boolean,
    required: true,
    default: false
  }
})