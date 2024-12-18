/**
 * @fileoverview TS 文件 transaction.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

��/ * *  
   *   �N�R�r`�g>N 
   * /  
 e x p o r t   e n u m   T r a n s a c t i o n S t a t u s   {  
     P E N D I N G   =   ' p e n d i n g ' ,  
     C O M M I T T E D   =   ' c o m m i t t e d ' ,  
     R O L L E D _ B A C K   =   ' r o l l e d _ b a c k ' ,  
     F A I L E D   =   ' f a i l e d '  
 }  
  
 / * *  
   *   �N�RM�n	�y� 
   * /  
 e x p o r t   i n t e r f a c e   T r a n s a c t i o n O p t i o n s   {  
     t i m e o u t ? :   n u m b e r ;  
     r e t r y C o u n t ? :   n u m b e r ;  
     i s o l a t i o n L e v e l ? :   ' R E A D _ C O M M I T T E D '   |   ' R E P E A T A B L E _ R E A D '   |   ' S E R I A L I Z A B L E ' ;  
 }  
  
 / * *  
   *   �N�RCQpenc 
   * /  
 e x p o r t   i n t e r f a c e   T r a n s a c t i o n M e t a d a t a   {  
     i d :   s t r i n g ;  
     n a m e :   s t r i n g ;  
     s t a r t T i m e :   n u m b e r ;  
     s t a t u s :   T r a n s a c t i o n S t a t u s ;  
     o p t i o n s ? :   T r a n s a c t i o n O p t i o n s ;  
 }  
  
 / * *  
   *   �N�Rg�R�c�S 
   * /  
 e x p o r t   i n t e r f a c e   I T r a n s a c t i o n S e r v i c e   {  
     / * *  
       *    _�Y N*N�e�v�N�R 
       *   @ p a r a m   n a m e   �N�RT�y 
       *   @ p a r a m   o p t i o n s   �N�RM�n	�y� 
       *   @ r e t u r n s   �N�RI D  
       * /  
     b e g i n T r a n s a c t i o n ( n a m e :   s t r i n g ,   o p t i o n s ? :   T r a n s a c t i o n O p t i o n s ) :   P r o m i s e < s t r i n g > ;  
  
     / * *  
       *   �c�N�N�R 
       *   @ p a r a m   t r a n s a c t i o n I d   �N�RI D  
       * /  
     c o m m i t T r a n s a c t i o n ( t r a n s a c t i o n I d :   s t r i n g ) :   P r o m i s e < v o i d > ;  
  
     / * *  
       *   �V�n�N�R 
       *   @ p a r a m   t r a n s a c t i o n I d   �N�RI D  
       * /  
     r o l l b a c k T r a n s a c t i o n ( t r a n s a c t i o n I d :   s t r i n g ) :   P r o m i s e < v o i d > ;  
  
     / * *  
       *   (W�N�R-NgbL��d\O 
       *   @ p a r a m   n a m e   �N�RT�y 
       *   @ p a r a m   o p e r a t i o n   ��gbL��v�d\O 
       *   @ p a r a m   o p t i o n s   �N�RM�n	�y� 
       *   @ r e t u r n s   �d\O�~�g 
       * /  
     e x e c u t e I n T r a n s a c t i o n < T > (  
         n a m e :   s t r i n g ,  
         o p e r a t i o n :   ( t r a n s a c t i o n I d :   s t r i n g )   = >   P r o m i s e < T > ,  
         o p t i o n s ? :   T r a n s a c t i o n O p t i o n s  
     ) :   P r o m i s e < T > ;  
  
     / * *  
       *   ���S�N�R�r` 
       *   @ p a r a m   t r a n s a c t i o n I d   �N�RI D  
       * /  
     g e t T r a n s a c t i o n S t a t u s ( t r a n s a c t i o n I d :   s t r i n g ) :   P r o m i s e < T r a n s a c t i o n S t a t u s > ;  
  
     / * *  
       *   ���S�N�RCQpenc 
       *   @ p a r a m   t r a n s a c t i o n I d   �N�RI D  
       * /  
     g e t T r a n s a c t i o n M e t a d a t a ( t r a n s a c t i o n I d :   s t r i n g ) :   P r o m i s e < T r a n s a c t i o n M e t a d a t a > ;  
  
     / * *  
       *   ���S;mÍ�N�Rpeϑ 
       * /  
     g e t A c t i v e T r a n s a c t i o n s C o u n t ( ) :   n u m b e r ;  
 }  
 
