import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Import DomSanitizer
import { ItemObject } from '@common/ItemObject';
import { injectTippyRef } from '@ngneat/helipopper';

@Component({
    selector: 'app-item-tooltip',
    templateUrl: './item-tooltip.component.html',
    styleUrls: ['./item-tooltip.component.scss'],
})
export class ItemTooltipComponent {
    @Input() itemObject: ItemObject | null;

    tippy = injectTippyRef();

    // Inject DomSanitizer
    constructor(private sanitizer: DomSanitizer) {}

    // Map of words to their corresponding colors
    private readonly highlightedWords: { [key: string]: string } = {
        rare: '#007bff', // Blue for "rare"
        epic: '#6f42c1', // Purple for "epic"
        legendary: '#ffc107', // Gold for "legendary"
        damage: '#dc3545', // Red for "damage"
        health: '#28a745', // Green for "health"
    };

    get itemDescription(): SafeHtml {
        //💀 trust me bro
        const description = this.itemObject?.description || '';
        return this.sanitizer.bypassSecurityTrustHtml(this.highlightWords(description));
    }

    get itemName(): string {
        return this.itemObject?.name ? this.capitalizeFirstLetter(this.itemObject.name) : '';
    }

    capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Highlight specific words with colors
    private highlightWords(text: string): string {
        let highlightedText = text;
        for (const [word, color] of Object.entries(this.highlightedWords)) {
            const regex = new RegExp(`(${word})`, 'gi'); // Case-insensitive global match
            highlightedText = highlightedText.replace(regex, `<span style="color: ${color}; font-weight: bold;">$1</span>`);
        }
        return highlightedText;
    }
}
