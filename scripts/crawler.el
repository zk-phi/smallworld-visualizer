(defconst num-pages 64)

(defun search-regex-all (regex)
  (let (res)
    (while (search-forward-regexp regex nil t)
      (push (match-string 0) res))
    res))

(defun simplify-name (name)
  (with-temp-buffer
    (save-excursion (insert name))
    (while (search-forward-regexp "&[a-z]+;" nil t)
      (let ((match (match-string 0)))
        (replace-match (cond ((string= match "&Omega;") "Ω")
                             ((string= match "&Xi;") "Ξ")
                             ((string= match "&alpha;") "α")
                             ((string= match "&beta;") "β")
                             ((string= match "&delta;") "δ")
                             ((string= match "&epsilon;") "ε")
                             ((string= match "&forall;") "∀")
                             ((string= match "&gamma;") "γ")
                             ((string= match "&infin;") "∞")
                             ((string= match "&ldquo;") "“")
                             ((string= match "&rdquo;") "”")
                             ((string= match "&times;") "×")
                             ((string= match "&zeta;") "ζ")
                             (t (error "Unknown escape string %s" match))))))
    (buffer-string)))

(defun simplify-ruby (ruby)
  (with-temp-buffer
    (save-excursion (insert (japanese-hiragana ruby)))
    (save-excursion (replace-regexp "[　・－-]\\|&.*;" ""))
    (save-excursion (replace-string "う゛" "ゔ"))
    (buffer-string)))

(defun crawl ()
  (let (lst)
    (dotimes (n num-pages)
      (with-temp-buffer
        (message "Crawling page %d of %d" (1+ n) num-pages)
        (save-excursion
          (insert (with-current-buffer
                      (url-retrieve-synchronously
                       (concat "https://www.db.yugioh-card.com/yugiohdb/card_search.action"
                               "?ope=1"
                               "&ctype=1"                          ; monster only
                               "&rp=100"                           ; 100 cards per page
                               "&jogai=2&jogai=9&jogai=10&jogai=17" ; exclude extra-deck monsters
                               "&page=" (number-to-string (1+ n))
                               "&request_locale=ja"))
                    (save-excursion (replace-string "" ""))
                    (save-excursion (replace-string "\n" ""))
                    (save-excursion (replace-string "\t" ""))
                    (decode-coding-string (buffer-string) 'utf-8))))
        (let* ((cards-raw (search-regex-all
                           "<div class=\"t_row c_normal\">\\(\n\\|.\\)*?<!-- \.t_row c_normal -->"))
               (cards-extracted (mapcar (lambda (str)
                                          (let ((lst (mapcar (lambda (regex)
                                                               (and (string-match regex str)
                                                                    (match-string 1 str)))
                                                             '("card_ruby\">\\(.*?\\)<"
                                                               "card_name\">\\(.*?\\)<"
                                                               "title=\"\\(.\\)属性\""
                                                               "<span>レベル \\(.*?\\)<"
                                                               "【\\(.*?\\)族"
                                                               "<span>攻撃力 \\(.*?\\)</span>"
                                                               "<span>守備力 \\(.*?\\)</span>"))))
                                            (setf (car lst) (simplify-ruby (car lst)))
                                            (setf (cadr lst) (simplify-name (cadr lst)))
                                            (apply 'vector lst)))
                                        cards-raw)))
          (setq lst (nconc lst cards-extracted)))))
    (with-temp-buffer
      (insert (json-encode lst))
      (write-file "../src/constants/cards.json"))))

;; (crawl)

;; -------------------------------------------

(defconst data
  (with-temp-buffer
    (insert-file-contents "../src/constants/cards.json")
    (json-parse-buffer :array-type 'list)))
