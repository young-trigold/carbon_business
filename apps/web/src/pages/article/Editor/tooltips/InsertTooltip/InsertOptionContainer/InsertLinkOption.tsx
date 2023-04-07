import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { memo, useMemo, useState } from 'react';
import { StyledOption } from '.';
import { useAppDispatch, useAppSelector } from '../../../../../../app/store';

const InsertLinkOption = () => {
  const dispatch = useAppDispatch();

  const [addModalVisible, setAddModalVisible] = useState(false);

  const closeModal = () => {
    setAddModalVisible(false);
  };

  const openModal = () => {
    setAddModalVisible(true);
  };

  const [formState, setFormState] = useState({ title: '', link: '' });

  const onTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const title = event.target.value;

    setFormState((pre) => ({
      ...pre,
      title,
    }));
  };

  const onLinkChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const link = event.target.value;

    setFormState((pre) => ({
      ...pre,
      link,
    }));
  };

  const { editorStore } = useAppSelector((state) => state.articlePage.editor);

  const addLink = () => {
    if (!editorStore) return;
    const { view: editorView } = editorStore;
    if (!editorView) return;
    const { state: editorState } = editorView;
    const { title, link } = formState;
    const attrs = { title, href: link };
    const { schema } = editorState;
    const node = schema.text(attrs.title, [schema.marks.link.create(attrs)]);
    const transaction = editorState.tr.replaceSelectionWith(node, false);
    editorView.dispatch(transaction);
    closeModal();
  };

  const disabled = useMemo(() => {
    const { title, link } = formState;
    let pass = true;
    const URLPattern =
      /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
    if (title.replace(/\s+/g, '') === '' || link.replace(/\s+/g, '') === '') pass = false;
    if (!URLPattern.test(link)) pass = false;
    return !pass;
  }, [formState.title, formState.link]);

  return (
    <>
      <StyledOption onClick={openModal}>
        <span>插入链接</span>
      </StyledOption>
      <Dialog maxWidth={false} open={addModalVisible} onClose={closeModal}>
        <DialogTitle>添加链接</DialogTitle>
        <DialogContent>
          <Box width={500} component="form">
            <TextField
              fullWidth
              value={formState.title}
              label="链接名称"
              multiline
              maxRows={6}
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onTitleChange}
            ></TextField>
            <TextField
              fullWidth
              value={formState.link}
              label="链接地址"
              multiline
              maxRows={6}
              sx={{
                margin: '0.5em 0',
              }}
              onChange={onLinkChange}
            ></TextField>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal}>取消</Button>
          <Button onClick={addLink} variant="contained" disabled={disabled}>
            添加
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(InsertLinkOption);
