import React, { useState, useEffect } from 'react';

import {
  Grid,
  Card,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Rating,
} from '@mui/material';
import { ISolution } from '../../types/solution';
import { ISolutionScore, ISearchScore } from '../../types/ranking';
import { Search } from '@mui/icons-material';

interface
 SolutionGalleryProps {
  solutions: Solution  { score: SolutionScore })[];
  onSearch: (keyword: string) => Promise<void>;
  onSortChange: (type: string) => void;
}

export const SolutionGallery: React.FC<SolutionGalleryProps> = ({
  solutions,
  onSearch,
  onSortChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('score');

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    await onSearch(term);
  };

  const handleSortChange = (type: string) => {
    setSortType(type);
    onSortChange(type);
  };

  return (
    <Box className="solution-gallery">
      <Box className="gallery-header">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索方案..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Box className="sort-options">
          <Chip
            label="综合排序"
            onClick={() => handleSortChange('score')}
            color={sortType === 'score' ? 'primary' : 'default'}
          />
          <Chip
            label="最新"
            onClick={() => handleSortChange('date')}
            color={sortType === 'date' ? 'primary' : 'default'}
          />
          <Chip
            label="最热"
            onClick={() => handleSortChange('popularity')}
            color={sortType === 'popularity' ? 'primary' : 'default'}
          />
        </Box>
      </Box>

      <Grid container spacing={3} className="solutions-grid">
        {solutions.map(solution => (
          <Grid item xs={12} sm={6} md={4} key={solution.id}>
            <SolutionCard solution={solution} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const SolutionCard: React.FC<{
  solution: ISolution & { score: ISolutionScore };
}> = ({ solution }) => {
  return (
    <Card className="solution-card">
      <Box className="card-cover">
        <img src={solution.coverImage} alt={solution.title} />
        <Box className="card-stats">
          <Rating value={solution.stats.rating} readOnly size="small" />
          <Typography variant="caption">{solutionstatsviews} </Typography>
        </Box>
      </Box>

      <Box className="card-content">
        <Typography variant="h6">{solutiontitle}</Typography>
        <Typography variant="body2" color="textSecondary">
          {solutiondescription}
        </Typography>

        <Box className="card-footer">
          <Box className="tags">
            {solution.tags.map(tag => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
          <Typography variant="caption" color="primary">
             {solutionscorefinalScoretoFixed1}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
