import { HistoryManager, HistoryService } from '@flowgram.ai/history';
import { useService, useUndoRedo } from '@flowgram.ai/free-layout-editor';
import { Modal, Tooltip } from '@douyinfe/semi-ui';
import { IconHistory, IconRedo, IconUndo } from '@douyinfe/semi-icons';

export function HistoryTools() {
  const historyService = useService(HistoryService) as HistoryService;
  const historyManager = useService(HistoryManager) as HistoryManager;
  const { undo, redo, canRedo, canUndo } = useUndoRedo();

  return (
    <>
      <IconUndo style={canUndo ? {} : { opacity: 0.5 }} onClick={() => undo()} />
      <IconRedo style={canRedo ? {} : { opacity: 0.5 }} onClick={() => redo()} />
      <IconHistory
        onClick={() => {
          const items = historyManager.historyStack.items;
          Modal.info({
            content: (
              <div>
                <button onClick={() => historyService.clear()}>clear history</button>
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>
                      <div>
                        {item.type}:
                        {item.operations.map((o, index) => (
                          <Tooltip key={index} content={o.description || ''}>
                            {o.label || o.type} uri: {o.uri}
                          </Tooltip>
                        ))}
                      </div>
                      <div>{item.time}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ),
            title: 'History Record',
          });
        }}
      />
    </>
  );
}
