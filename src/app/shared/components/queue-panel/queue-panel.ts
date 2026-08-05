import { Component, HostListener, inject, signal } from '@angular/core';
import { PlayerService } from '../../../core/services/player.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { CoverPipe } from '../../pipes/cover.pipe';

@Component({
  selector: 'app-queue-panel',
  imports: [DurationPipe, CoverPipe],
  templateUrl: './queue-panel.html',
  styleUrl: './queue-panel.css',
})
export class QueuePanel {
  private readonly playerService = inject(PlayerService);
  protected readonly isOpen = this.playerService.isQueueOpen;
  protected readonly queue = this.playerService.queue;
  protected readonly currentIndex = this.playerService.currentIndex;
  protected readonly currentTrack = this.playerService.currentTrack;
  protected readonly isPlaying = this.playerService.isPlaying;

  protected readonly draggedIndex = signal<number | null>(null);

  protected onClose(): void {
    this.playerService.isQueueOpen.set(false);
  }

  protected onPlayAt(index: number): void {
    this.playerService.playAt(index);
  }

  protected onRemove(index: number): void {
    this.playerService.removeFromQueue(index);
  }

  protected onClear(): void {
    this.playerService.clearQueue();
  }

  protected onDragStart(index: number): void {
    this.draggedIndex.set(index);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  protected onDrop(index: number): void {
    const from = this.draggedIndex();

    if (from !== null) {
      this.playerService.moveInQueue(from, index);
    }

    this.draggedIndex.set(null);
  }

  protected onDragEnd(): void {
    this.draggedIndex.set(null);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) {
      this.onClose();
    }
  }
}
