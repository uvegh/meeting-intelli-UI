import { ActionItem } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ActionItemsTableProps {
  actionItems: ActionItem[];
}

export default function ActionItemsTable({ actionItems }: ActionItemsTableProps) {
  const getPriorityVariant = (priority: string): 'destructive' | 'default' | 'secondary' => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      case 'Low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assignee</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actionItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.assignee}</TableCell>
              <TableCell>{item.task}</TableCell>
              <TableCell>
                {item.dueDate ? format(new Date(item.dueDate), 'MMM d, yyyy') : 'No due date'}
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityVariant(item.priority)}>
                  {item.priority}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}