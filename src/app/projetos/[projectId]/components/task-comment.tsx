import { UserAvatar } from './user-avatar';

export function TaskComment() {
  return (
    <div className="flex gap-2">
      <div>
        <UserAvatar userInitials="TA" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          <span className="text-sm font-semibold">Thiago Alves</span>
          <span className="text-sm text-muted-foreground">
            em 17/01/2024 às 10:15
          </span>
        </div>
        <span className="text-muted-foreground">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta
          consectetur, debitis quaerat similique non natus velit quis commodi
          laudantium expedita architecto nisi laboriosam sequi aliquid harum
          quia necessitatibus doloremque quae!
        </span>
      </div>
    </div>
  );
}
