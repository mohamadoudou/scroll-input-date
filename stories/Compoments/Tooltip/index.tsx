import React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  Placement,
  useClick,
} from '@floating-ui/react';
import styles from './tooltip.module.scss';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerElement: React.ReactNode;
  children: React.ReactNode;
  placement: Placement;
};

function Tooltip({ isOpen, setIsOpen, triggerElement, children }: Props) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), shift()],
  });

  // Event listeners to change the open state
  const click = useClick(context);
  const dismiss = useDismiss(context);
  // Role props for screen readers
  const role = useRole(context, { role: 'tooltip' });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <div>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {triggerElement}
      </div>
      {/* id here allow FloatingPortal to mount as a child of the element that have this id */}
      <FloatingPortal id="scroll-date-picker">
        {isOpen && (
          <div
            className={styles.tooltip}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {children}
          </div>
        )}
      </FloatingPortal>
    </div>
  );
}

export default Tooltip;
