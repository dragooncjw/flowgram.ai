/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import styled from 'styled-components';

export const UIContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const UIMain = styled.div`
  flex-grow: 1;

  & .semi-tree-select,
  & .semi-input-number,
  & .semi-select {
    width: 100%;
  }
`;

export const UITrigger = styled.div``;
